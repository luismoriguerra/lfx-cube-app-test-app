// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Percent } from '@amcharts/amcharts5';
import { Component, OnInit } from '@angular/core';
import { BarChartConfig, GranularityEnum } from 'lfx-insights';

@Component({
  selector: 'lfx-time-to-merge-pr',
  templateUrl: './time-to-merge-pr.component.html',
  styleUrls: ['./time-to-merge-pr.component.scss']
})
export class TimeToMergePrComponent implements OnInit {
  public config: BarChartConfig = {
    showLegend: true,
    yAxisName: 'Pull Requests',
    barWidth: new Percent(40),
    series: [
      {
        name: 'Pull Requests',
        valueYField: 'value',
        valueXField: 'date',
        color: '#bd6bff'
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
  public steps = [
    {
      icon: 'far fa-file-code',
      title: 'Created',
      value: '6h 16m',
      percent: 22
    },
    {
      svgIcon: 'assets/icons/icons8-pull-request-32.png',
      title: 'Review lag',
      value: '3h 24m',
      percent: -67
    },
    {
      icon: 'fal fa-eye',
      title: 'Review',
      value: '11h 14m',
      percent: -17
    },
    {
      icon: 'far fa-hourglass',
      title: 'Merge',
      value: '2h 13m',
      percent: -47
    }
  ];
  public constructor() {}

  public ngOnInit() {}
}
