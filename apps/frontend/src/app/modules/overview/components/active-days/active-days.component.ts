// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component, ElementRef, OnInit } from '@angular/core';
import { activeDaysChartData, getActiveDaysSummary } from '@app/shared/cubejs/metrics/active-days/activeDays';
import { CubeService } from '@app/shared/services/cube.service';
import { FilterService, InsightsFilters } from '@app/shared/services/filter.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChartNames } from 'lfx-insights';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'lfx-active-days',
  templateUrl: './active-days.component.html',
  styleUrls: ['./active-days.component.scss']
})
export class ActiveDaysComponent implements OnInit {
  public showTooltip = false;
  public config = this.setChartData();
  public activeDays: number = 0;
  public inactiveDays: number = 0;
  public avgContributions: number = 0;
  public previousActiveDays: number;
  public variation: number;
  public fullChartDescription: string;
  public variationCategory: string;
  public cardName = ChartNames.ActiveDaysChart;

  public constructor(public elementRef: ElementRef, private cubeService: CubeService, private filterService: FilterService) {}

  public ngOnInit() {
    this.filterService.filter$.pipe(untilDestroyed(this)).subscribe((filters) => {
      this.handlerActiveDaysFilters(filters);
    });
  }

  public async handlerActiveDaysFilters(filters: InsightsFilters) {
    const data = await getActiveDaysSummary(this.cubeService, filters);
    this.fullChartDescription = data.fullChartDescription;
    this.variation = data.variation;
    this.variationCategory = data.variationCategory;
    this.avgContributions = data.avgContributions;
  }

  public setChartData(activeDays: number = 0, inactiveDays: number = 0) {
    return {
      height: 400,
      data: activeDaysChartData(activeDays, inactiveDays)
    };
  }

  public toggleTooltip() {
    this.showTooltip = !this.showTooltip;
  }
}
