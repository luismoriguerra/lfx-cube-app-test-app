// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component } from '@angular/core';
import { Percent } from '@amcharts/amcharts5';
import { BarChartConfig, LineChartConfig } from 'lfx-insights';

@Component({
  selector: 'lfx-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent {
  public config: LineChartConfig = {
    useMicroTheme: true,
    yAxisName: 'date',
    series: [
      {
        field: 'value',
        name: 'Contributors',
        color: '#ff3185'
      }
    ],
    xAxis: {
      field: 'date',
      axisType: 'date'
    },
    type: 'smooth'
  };

  public commitsChartConfig: BarChartConfig = {
    showLegend: true,
    barWidth: new Percent(40),
    series: [
      {
        name: 'Commits',
        valueYField: 'value',
        valueXField: 'date',
        color: '#bd6bff'
      }
    ],
    xAxis: {
      field: 'date',
      axisType: 'date'
    },
    type: 'normal'
  };
}
