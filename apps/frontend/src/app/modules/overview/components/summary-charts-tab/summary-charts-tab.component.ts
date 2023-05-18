// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Root } from '@amcharts/amcharts5';

import { AfterViewInit, Component, Input } from '@angular/core';
import { LineChartConfig } from 'lfx-insights';

@Component({
  selector: 'lfx-summary-charts-tab',
  templateUrl: './summary-charts-tab.component.html'
})
export class SummaryChartsTabComponent implements AfterViewInit {
  @Input() public icon: IconProp = ['fal', 'user'];
  @Input() public title: string = 'Contributors';
  @Input() public mainValue: string | number = 0;
  @Input() public secondaryValue = 0;
  @Input() public secondaryValueColorType = 'negative';
  @Input() public chartName: string = 'chart-contributors-mini';
  @Input() public active = false;
  @Input() public config: LineChartConfig;
  // TODO: chart input will be removed in next PR in favor of reusable components
  @Input() public chart: any;
  @Input() public chartData: any[];
  @Input() public isDummyData = false;

  public rootDiv: Root;

  public ngAfterViewInit(): void {
    if (!this.config && this.chart) {
      this.rootDiv = this.chart();
    }
  }
}
