// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component, AfterViewInit, OnInit, ElementRef } from '@angular/core';
import { GeographicalDistribution } from '@app/shared/cubejs/metrics/geographical-distribution';
import { ChartNames, MapChartConfig } from 'lfx-insights';
import _ from 'lodash';

@Component({
  selector: 'lfx-geographical-distribution',
  templateUrl: './geographical-distribution.component.html'
})
export class GeographicalDistributionComponent implements OnInit, AfterViewInit {
  public topRegions: { name: string; value: string; repository: string }[] = [];

  public mapConfig: MapChartConfig = {
    series: {
      idField: 'id',
      valueField: 'value'
    },
    tooltipHTML: `<div style="color: #fff; font-size: 12px; display: flex">
    <div
      class="group-left"
      style="
        margin-top: 0.2rem;
        margin-right: 0.2rem;
        width: 12px;
        height: 12px;
        border-radius: 100%;
        background-color: #46b6c7;
      "
    ></div>
    <div class="group-right">
      <span style="font-weight: bold"> {country} {count} </span>
      <div style="font-weight: bold">Most Recent Activity</div>
      <div>{recentActivityRepository}</div>
    </div>
  </div>`
  };

  public chartName: string = ChartNames.ContributorsByCountry;
  public allCountriesVariation: number = 0;
  public noUsaVariation: number = 0;

  public constructor(public elementRef: ElementRef) {}

  public ngOnInit(): void {}

  public ngAfterViewInit(): void {
    // console.log(this.geoData);
    // getChartGeographical(this.geoData);
  }

  public mapDataChanged(response: GeographicalDistribution) {
    this.allCountriesVariation = response.deltaPercentage;
    this.noUsaVariation = response.noUsaDeltaPercentage;
    const data = response.countryListWithShare;
    let count = 0;
    this.topRegions = [];
    data.forEach((d) => {
      if (count < 5) {
        this.topRegions.push({
          name: d.country,
          value: d.share + '%',
          repository: d.recentActivityRepository
        });
        count++;
      }
    });
  }
}
