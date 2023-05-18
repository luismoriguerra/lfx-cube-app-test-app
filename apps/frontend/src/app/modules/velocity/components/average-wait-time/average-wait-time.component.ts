// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Percent } from '@amcharts/amcharts5';
import { Component, ElementRef } from '@angular/core';
import { BarChartConfig, GranularityEnum } from 'lfx-insights';

@Component({
  selector: 'lfx-average-wait-time',
  templateUrl: './average-wait-time.component.html',
  styleUrls: ['./average-wait-time.component.scss']
})
export class AverageWaitTimeComponent {
  public config: BarChartConfig = {
    showLegend: false,
    yAxisName: 'Time in Hours',
    barWidth: new Percent(40),
    targetValue: 7,
    series: [
      {
        name: 'Business Hours',
        valueYField: 'value',
        valueXField: 'date',
        color: '#0068FA'
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
    type: 'normal',
    annotationSettings: {
      verticalAlign: '-top-[10%]',
      horizontalAlign: 'left-[45%]',
      template: `<span class="text-gray-dark text-xl font-bold font-sans">
      {value}
      <span class="text-sm font-normal {changeDirection} text-red-dark">{changes}</span>
    </span>
    <span class="text-gray-pale text-tiny font-sans">{text}</span>`
    }
  };

  public constructor(public elementRef: ElementRef) {}
}
