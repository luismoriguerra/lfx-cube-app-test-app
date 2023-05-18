// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Percent } from '@amcharts/amcharts5';
import { Component, ElementRef } from '@angular/core';
import { BarChartConfig, GranularityEnum } from 'lfx-insights';

@Component({
  selector: 'lfx-work-time-distribution',
  templateUrl: './work-time-distribution.component.html',
  styleUrls: ['./work-time-distribution.component.scss']
})
export class WorkTimeDistributionComponent {
  public config: BarChartConfig = {
    showLegend: true,
    yAxisName: 'Hours',
    barWidth: new Percent(40),
    series: [
      {
        name: 'Business Hours',
        valueYField: 'businessHours',
        valueXField: 'date',
        color: '#0068FA'
      },
      {
        name: 'Evenings',
        valueYField: 'evenings',
        valueXField: 'date',
        color: '#bd6bff'
      },
      {
        name: 'Weekends',
        valueYField: 'weekends',
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
    type: 'stacked',
    annotationSettings: {
      verticalAlign: 'top-[10%]',
      horizontalAlign: 'right-[2%]',
      template: `<span class="text-gray-dark text-xl font-bold font-sans">
      {value}
      <span class="text-sm font-normal {changeDirection}">{changes}</span>
    </span>
    <span class="text-gray-f83 text-tiny font-sans">{text}</span>`
    }
  };

  public constructor(public elementRef: ElementRef) {}
}
