// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Root } from '@amcharts/amcharts5';
import { AfterViewInit, Component, Input, ElementRef } from '@angular/core';
import { LineChartConfig } from 'lfx-insights';

@Component({
  selector: 'lfx-summary-charts-content-item',
  templateUrl: './summary-charts-content-item.component.html'
})
export class SummaryChartsContentItemComponent implements AfterViewInit {
  @Input() public title = 'CONTRIBUTORS';
  @Input() public subtitle: string = 'Total number of people contributing to a project';
  @Input() public descriptionP1: string = 'Contributors';
  @Input() public descriptionP2: string = 'increased by 17%';
  @Input() public descriptionP3: string = 'compared to the previous time period.';
  @Input() public iconType: string = 'positive';
  @Input() public chartName: string = 'chart-contributors-full';
  @Input() public config: LineChartConfig;
  // TODO: chart input will be removed in next PR in favor of reusable components
  @Input() public chart: any;
  @Input() public chartData: any[];
  @Input() public isDummyData = false;
  @Input() public chartWikiLink = '';

  public rootDiv: Root;

  public constructor(public elementRef: ElementRef) {}

  public ngAfterViewInit(): void {
    if (!this.config && this.chart) {
      this.rootDiv = this.chart && this.chart instanceof Function && this.chart();
    }
  }
}
