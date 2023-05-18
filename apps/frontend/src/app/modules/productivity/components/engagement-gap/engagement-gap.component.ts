// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component, ElementRef } from '@angular/core';
import { GranularityEnum, LineChartConfig } from 'lfx-insights';

@Component({
  selector: 'lfx-engagement-gap',
  templateUrl: './engagement-gap.component.html',
  styleUrls: ['./engagement-gap.component.scss']
})
export class EngagementGapComponent {
  public chartName = 'engagement-gap-chart';
  public config: LineChartConfig = {
    showLegend: true,
    height: 340,
    targetValue: 9,
    yAxisName: 'PR Comments Gap',
    series: [
      {
        field: 'value',
        name: 'PR Comments Gap',
        color: '#0068fa',
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
      template: `<div class="absolute flex flex-col top-0 left-[15%] annotation w-[190px]">
    <span class="text-gray-dark text-2.5xl font-bold font-sans">{value}x <span class="text-sm font-normal {changeDirection}">{changes}</span></span>
    <span class="text-gray-pale text-base font-sans">{text}</span>
    </div>`
    }
  };

  public constructor(public elementRef: ElementRef) {}
}
