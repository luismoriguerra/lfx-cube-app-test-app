// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component, ElementRef, OnInit } from '@angular/core';
import { workTimeDistributionQuery } from '@app/shared/cubejs/metrics/activities/WorkTimeDistribution';
import { CubeService } from '@app/shared/services/cube.service';
import { FilterService, InsightsFilters } from '@app/shared/services/filter.service';
import { metrics, timezones } from '@app/shared/utils/dropdown-helpers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChartNames, HeatChartConfig } from 'lfx-insights';
import { combineLatest, forkJoin, switchMap, take } from 'rxjs';
import { DateTime } from 'luxon';
import { FormBuilder, FormGroup } from '@angular/forms';
import _ from 'lodash';
import { HeatMapData } from '@app/shared/interface/common';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'lfx-work-time-distribution',
  templateUrl: './work-time-distribution.component.html',
  styleUrls: ['./work-time-distribution.component.scss']
})
export class WorkTimeDistributionComponent implements OnInit {
  public showTooltip = false;
  public metrics = metrics;
  public timezones = timezones;
  public defaultMetric = metrics[0].value;
  public defaultTimezone = 'UTC-8';
  public config: HeatChartConfig = {
    categoryXField: 'weekday',
    categoryYField: 'hour',
    valueField: 'value',
    startColor: '#f7f7f7',
    endColor: '#4996ff',
    height: 400,
    startText: 'Low Activity',
    endText: 'High Activity'
  };
  public chartName = ChartNames.WorkTimeDistribution;
  public heatmapData: HeatMapData[] = [];
  public currentData: HeatMapData[] = [];
  public previousData: HeatMapData[] = [];
  public isLoading: boolean = true;
  public form: FormGroup;
  public breakdowns = {
    business: '',
    evenings: '',
    weekends: '',
    differenceFromPrevious: '',
    direction: '' // up or down
  };
  public businessStart = 8;
  public businessEnd = 17;

  private weekDays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  public constructor(public elementRef: ElementRef, public filterService: FilterService, private cubeService: CubeService, private fb: FormBuilder) {
    this.form = this.fb.group({
      metrics: [''],
      timezones: [this.defaultTimezone],
      githubOnly: [true]
    });
  }

  public ngOnInit() {
    combineLatest([this.form.valueChanges, this.filterService.filter$])
      .pipe(
        untilDestroyed(this),
        switchMap((changes: [fromChange: any, filter: InsightsFilters]) => {
          this.isLoading = true;
          this.setDefaults();
          // TODO: remove this later
          // the filter repository currently has a default kubernetes/kubernetes filter which shouldn't be
          // however other components might be using that right now
          const newFilter = changes[1] ? { ...changes[1] } : this.filterService.currentFilter;
          if (newFilter.repositories?.length === 1 && newFilter.repositories[0] === 'kubernetes/kubernetes') {
            newFilter.repositories = [];
          }

          return forkJoin([
            this.cubeService
              .getTableObs(
                workTimeDistributionQuery(newFilter, changes[0] ? changes[0].metrics : this.defaultMetric, changes[0].githubOnly ? 'github' : '', false)
              )
              .pipe(take(1)),
            this.cubeService
              .getTableObs(
                workTimeDistributionQuery(newFilter, changes[0] ? changes[0].metrics : this.defaultMetric, changes[0].githubOnly ? 'github' : '', true)
              )
              .pipe(take(1))
          ]);
          // return this.cubeService.getTableObs(workTimeDistributionQuery(newFilter, changes[0] ? changes[0].metrics : this.defaultMetric));
        })
      )
      .subscribe((res) => {
        // TODO: compute the
        // console.log(res);
        this.heatmapData = this.convertToHeatmapData(res[0], true);
        this.currentData = this.convertToHeatmapData(res[0]);
        this.previousData = this.convertToHeatmapData(res[1]);

        this.computeBreakdowns();
        this.isLoading = false;
      });

    this.form.controls.metrics.setValue(this.defaultMetric);
  }

  public get selectedTimeZoneLabel(): string {
    const lbl = _.filter(this.timezones, { value: this.form.value.timezones });

    return lbl.length > 0 ? lbl[0].label : '';
  }

  public toggleTooltip() {
    this.showTooltip = !this.showTooltip;
  }

  public formatTime(time: number, minute: string): string {
    return `${time.toString().padStart(2, '0')}${minute}`;
  }

  private convertToHeatmapData(data: any, roundOff: boolean = false): HeatMapData[] {
    const timeZone = this.form.value.timezones;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const tmpData: any = roundOff ? { ...this.createEmptyHeatmapData() } : {}; // { weekday: { [hours]: count }}
    const tmpHeatmap: HeatMapData[] = []; // { weekday: { [hours]: count }}

    data.tableData.forEach((d: any) => {
      // convert the timestamp into the selected timezone
      const convertedDate = DateTime.fromISO(d['Activities.timestamp']).setZone(timeZone);
      const weekDayNum: number = convertedDate.weekday === 7 ? 0 : convertedDate.weekday;
      const hourRounded = roundOff && convertedDate.hour % 2 === 1 ? convertedDate.hour - 1 : convertedDate.hour;
      if (tmpData[weekDayNum]) {
        if (tmpData[weekDayNum][hourRounded]) {
          // insert data data into each bucket
          tmpData[weekDayNum][hourRounded].push(d);
        } else {
          tmpData[weekDayNum][hourRounded] = [d];
        }
      } else {
        tmpData[weekDayNum] = { [hourRounded]: [d] };
      }
    });

    // after separating the data into weekday/hours group, we now combine them into 1 array
    Object.keys(tmpData).forEach((wkDay: string) => {
      Object.keys(tmpData[wkDay]).forEach((hour: string) => {
        tmpHeatmap.push({
          hour: `${hour.padStart(2, '0')}:00`,
          hourValue: +hour,
          weekday: this.weekDays[+wkDay],
          value: tmpData[wkDay][hour].length - (roundOff ? 1 : 0) // subtract the fake data inserted
        });
      });
    });

    return tmpHeatmap;
  }

  private createEmptyHeatmapData(): { [key: string]: { [key: string]: any[] } } {
    const tmp: any = {};

    this.weekDays.forEach((_w: string, idx: number) => {
      tmp[idx] = {};
      Array(12)
        .fill(0)
        .forEach((v: number, i: number) => {
          tmp[idx][i * 2] = [false];
        });
    });

    return tmp;
  }

  private computeBreakdowns(): void {
    const totalCurrent = _.sumBy(this.currentData, 'value');
    const totalPrevious = _.sumBy(this.previousData, 'value');
    // filter the values that are in the business hours(8am to 5pm) of the selected timezone
    const businessHours = _.sumBy(
      _.filter(
        this.currentData,
        (d: HeatMapData) => d.hourValue >= this.businessStart && d.hourValue <= this.businessEnd && d.weekday !== 'Saturday' && d.weekday !== 'Sunday'
      ),
      'value'
    );

    const businessHoursPrev = _.sumBy(
      _.filter(
        this.previousData,
        (d: HeatMapData) => d.hourValue >= this.businessStart && d.hourValue <= this.businessEnd && d.weekday !== 'Saturday' && d.weekday !== 'Sunday'
      ),
      'value'
    );

    const eveningHours = _.sumBy(
      _.filter(
        this.currentData,
        (d: HeatMapData) => (d.hourValue > this.businessEnd || d.hourValue < this.businessStart) && d.weekday !== 'Saturday' && d.weekday !== 'Sunday'
      ),
      'value'
    );

    const weekendHours = _.sumBy(
      _.filter(this.currentData, (d: HeatMapData) => d.weekday === 'Saturday' || d.weekday === 'Sunday'),
      'value'
    );

    const businessPercentCurrent = (businessHours / totalCurrent) * 100;
    const businessPercentPrevious = (businessHoursPrev / totalPrevious) * 100;

    if (totalCurrent > 0) {
      this.breakdowns = {
        business: businessPercentCurrent.toFixed(2) + '%',
        evenings: ((eveningHours / totalCurrent) * 100).toFixed(2) + '%',
        weekends: ((weekendHours / totalCurrent) * 100).toFixed(2) + '%',
        differenceFromPrevious: Math.abs(Math.round(businessPercentCurrent - businessPercentPrevious)).toString() + '%',
        direction: businessPercentCurrent - businessPercentPrevious > 0 ? 'up' : 'down' // up or down
      };
    }
  }

  private setDefaults(): void {
    this.heatmapData = [];
    this.currentData = [];
    this.previousData = [];
    this.breakdowns = {
      business: '0%',
      evenings: '0%',
      weekends: '0%',
      differenceFromPrevious: '0%',
      direction: 'up'
    };
  }
}
