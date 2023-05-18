// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component, ElementRef } from '@angular/core';
import { GranularityEnum, LineChartConfig } from 'lfx-insights';

@Component({
  selector: 'lfx-commits-per-day',
  templateUrl: './commits-per-day.component.html',
  styleUrls: ['./commits-per-day.component.scss']
})
export class CommitsPerDayComponent {
  public config: LineChartConfig = {
    showLegend: true,
    yAxisName: 'Commits',
    max: 14,
    series: [
      {
        field: 'value',
        name: 'Commits',
        color: '#0039b8',
        bullets: true
      }
    ],
    xAxis: {
      field: 'date',
      axisType: 'date',
      granularity: GranularityEnum.week
    },
    type: 'smooth',
    annotationSettings: {
      verticalAlign: 'top-[10%]',
      horizontalAlign: 'left-[15%]',
      template: `<span class="text-gray-dark text-xl font-bold font-sans">
      {value}
      <span class="text-sm font-normal {changeDirection}">{changes}</span>
    </span>
    <span class="text-gray-f83 text-tiny font-sans">{text}</span>`
    }
  };

  public constructor(public elementRef: ElementRef) {}
}
