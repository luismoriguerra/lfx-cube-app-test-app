// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Percent } from '@amcharts/amcharts5';
import { Component } from '@angular/core';
import { BarChartConfig, GranularityEnum } from 'lfx-insights';

@Component({
  selector: 'lfx-build-failure-rate',
  templateUrl: './build-failure-rate.component.html',
  styleUrls: ['./build-failure-rate.component.scss']
})
export class BuildFailureRateComponent {
  public config: BarChartConfig = {
    showLegend: true,
    yAxisName: 'Failures',
    barWidth: new Percent(40),
    series: [
      {
        name: 'Failures',
        valueYField: 'value',
        valueXField: 'date',
        color: '#46b6c7'
      }
    ],
    xAxis: {
      field: 'date',
      axisType: 'date',
      granularity: GranularityEnum.week,
      groupData: true,
      dateFormats: {
        ['week']: 'MMM dd'
      }
    },
    type: 'normal'
  };
  public buildBreaks = [
    {
      icon: 'fal fa-exclamation-triangle',
      title: 'jobs Failed',
      value: 122,
      percent: -22
    },
    {
      icon: 'fal fa-undo',
      title: 'Build Time',
      value: '6h 22m',
      percent: -67
    }
  ];
  public constructor() {}
}
