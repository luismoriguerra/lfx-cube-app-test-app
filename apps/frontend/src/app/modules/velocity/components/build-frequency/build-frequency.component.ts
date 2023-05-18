// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Percent } from '@amcharts/amcharts5';
import { Component } from '@angular/core';
import { BarChartConfig, GranularityEnum, LineChartConfig } from 'lfx-insights';

@Component({
  selector: 'lfx-build-frequency',
  templateUrl: './build-frequency.component.html',
  styleUrls: ['./build-frequency.component.scss']
})
export class BuildFrequencyComponent {
  public buildFrequencyConfig: LineChartConfig = {
    showLegend: true,
    yAxisName: 'Builds',
    series: [
      {
        field: 'value',
        name: 'Builds',
        color: '#4996ff',
        bullets: true
      }
    ],
    xAxis: {
      field: 'date',
      axisType: 'date',
      granularity: GranularityEnum.week
    },
    type: 'smooth'
  };

  public pRSizeBreakDownConfig: BarChartConfig = {
    showLegend: false,
    yAxisName: undefined,
    barWidth: new Percent(40),
    series: [
      {
        name: 'Small',
        valueYField: 'small',
        valueXField: 'date',
        color: '#f3f2f3'
      },
      {
        name: 'Medium',
        valueYField: 'medium',
        valueXField: 'date',
        color: '#e6e5e6'
      },
      {
        name: 'Large',
        valueYField: 'large',
        valueXField: 'date',
        color: '#c7c6c8'
      },
      {
        name: 'Gigantic',
        valueYField: 'gigantic',
        valueXField: 'date',
        color: '#a0a0a3'
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
      template: `<span class="text-gray-dark text-lg font-bold font-sans">
      {value}
      <span class="text-sm font-normal {changeDirection}">{changes}</span>
    </span>
    <span class="text-gray-pale text-sm font-sans">{text}</span>`
    }
  };
  public prSizeBreakDownLegends = [
    {
      name: 'Small',
      percent: '89.9%',
      changeFromPrevious: -2
    },
    {
      name: 'Medium',
      percent: '89.9%',
      changeFromPrevious: -3
    },
    {
      name: 'Large',
      percent: '89.9%',
      changeFromPrevious: -2
    },
    {
      name: 'Gigantic',
      percent: '89.9%',
      changeFromPrevious: 3
    }
  ];
  public constructor() {}
}
