// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, Input, NgZone, OnChanges, OnDestroy, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { ChartBaseComponent } from '@app/shared/classes/chart-base.component';
import { ChartService } from '@app/shared/services/chart.service';
import { FilterService } from '@app/shared/services/filter.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { HeatChartConfig } from 'lfx-insights';
import { switchMap } from 'rxjs';
import { DownloadService } from '@app/shared/services/download.service';
import _ from 'lodash';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'lfx-heat-chart',
  templateUrl: './heat-chart.component.html',
  styleUrls: ['./heat-chart.component.scss']
})
export class HeatChartComponent extends ChartBaseComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() public config!: HeatChartConfig;
  @Input() public chartName!: string;
  @Input() public data: any[] = [];

  private root!: am5.Root;
  private chartRef!: am5xy.XYChart;

  public constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private zone: NgZone,
    private chartService: ChartService,
    public changeDetectorRef: ChangeDetectorRef,
    public filterService: FilterService,
    private downloadService: DownloadService
  ) {
    super(changeDetectorRef, filterService);
  }

  // Run the function only in the browser
  public browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.data) {
      this.changeData();
    }
  }

  public ngAfterViewInit() {
    // this.loadData();
    // Chart code goes in here
    this.browserOnly(() => {
      // Create root element
      const root = am5.Root.new(this.chartName);

      // Set themes
      root.setThemes([am5themes_Animated.new(root)]);

      // remove footer logo
      // eslint-disable-next-line no-underscore-dangle
      root._logo?.children.clear();

      // Create chart
      const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: false,
          panY: false,
          wheelX: 'none',
          wheelY: 'none',
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
          paddingLeft: 0,
          height: this.config.height,
          layout: root.verticalLayout
        })
      );

      // Create axes and their renderers
      const yRenderer = am5xy.AxisRendererY.new(root, {
        visible: false,
        minGridDistance: 20,
        inversed: true
      });

      yRenderer.grid.template.set('visible', false);
      yRenderer.labels.template.setAll({
        fontSize: '11px',
        fill: am5.color('#807f83')
      });

      const yAxis = chart.yAxes.push(
        am5xy.CategoryAxis.new(root, {
          maxDeviation: 0,
          renderer: yRenderer,
          categoryField: this.config.categoryYField // 'hour'
        })
      );

      const xRenderer = am5xy.AxisRendererX.new(root, {
        visible: false,
        minGridDistance: 30,
        opposite: true
      });

      xRenderer.grid.template.set('visible', false);
      xRenderer.labels.template.setAll({
        fontSize: '13px',
        fill: am5.color('#807f83')
      });

      const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          renderer: xRenderer,
          categoryField: this.config.categoryXField // 'weekday'
        })
      );

      // Create series
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          calculateAggregates: true,
          stroke: am5.color(0xffffff),
          clustered: false,
          xAxis,
          yAxis,
          categoryXField: this.config.categoryXField,
          categoryYField: this.config.categoryYField,
          valueField: this.config.valueField
        })
      );

      series.columns.template.setAll({
        tooltipText: '{value}',
        cornerRadiusBL: 10,
        cornerRadiusTL: 10,
        cornerRadiusBR: 10,
        cornerRadiusTR: 10,
        width: 66, //am5.percent(100),
        height: 13
      });
      // Create modal for a "no data" note
      const modal = am5.Modal.new(root, {
        content: 'No data to display'
      });

      series.events.on('datavalidated', (ev) => {
        if (ev.target.data.length < 1 && !this.isLoading) {
          modal.open();
        } else {
          modal.close();
        }
      });

      // Set up heat rules
      series.set('heatRules', [
        {
          target: series.columns.template,
          min: am5.color(this.config.startColor),
          max: am5.color(this.config.endColor),
          dataField: this.config.valueField,
          key: 'fill'
        }
      ]);
      // Add heat legend
      chart.bottomAxesContainer.set('layout', root.horizontalLayout);
      chart.bottomAxesContainer.set('centerX', am5.percent(-25));
      chart.bottomAxesContainer.children.push(
        am5.Label.new(root, {
          text: this.config.startText,
          fill: am5.color('#333333'),
          fontSize: '13px',
          fontFamily: 'Open Sans'
        })
      );
      chart.bottomAxesContainer.children.push(
        am5.HeatLegend.new(root, {
          orientation: 'horizontal',
          startColor: am5.color(this.config.startColor),
          endColor: am5.color(this.config.endColor),
          width: 80
        })
      );

      chart.bottomAxesContainer.children.push(
        am5.Label.new(root, {
          text: this.config.endText,
          fill: am5.color('#333333'),
          fontSize: '13px',
          fontFamily: 'Open Sans'
        })
      );

      // Set data

      const axisData = this.prepareData();
      series.data.setAll(this.data);
      xAxis.data.setAll(axisData.xAxisData);

      yAxis.data.setAll(axisData.yAxisData);

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
      this.root = root;
      this.chartRef = chart;
    });
  }

  public ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }

  public checkEmptyData(): boolean {
    // TODO: implement this
    return false;
  }

  public loadData(): void {
    // TODO: add hiding and showing of the loader icon
    // this.filters$
    //   .pipe(
    //     untilDestroyed(this),
    //     switchMap((filters) => this.chartService.getChartData(this.chartName, filters).pipe(untilDestroyed(this)))
    //   )
    //   .subscribe((data: any) => {
    //     this.data = data;
    //     this.downloadService.updateReadToDownload(this.chartName, data);
    //     this.changeData();
    //   });
  }

  private prepareData() {
    const xAxisSet = new Set<string>();
    const yAxisSet = new Set<string>();
    const xAxisData: any[] = [];
    const yAxisData: any[] = [];
    this.data.forEach((element) => {
      if (!xAxisSet.has(element[this.config.categoryXField])) {
        xAxisSet.add(element[this.config.categoryXField]);
        xAxisData.push({
          [this.config.categoryXField]: element[this.config.categoryXField]
        });
      }
      if (!yAxisSet.has(element[this.config.categoryYField])) {
        yAxisSet.add(element[this.config.categoryYField]);
        yAxisData.push({
          [this.config.categoryYField]: element[this.config.categoryYField]
        });
      }
    });

    return {
      xAxisData,
      yAxisData: _.orderBy(yAxisData, [this.config.categoryYField], ['asc'])
    };
  }

  private changeData(): void {
    if (this.chartRef) {
      const data = this.prepareData();
      this.chartRef.xAxes.each((axis: am5xy.Axis<am5xy.AxisRenderer>) => {
        axis.data.setAll(data.xAxisData);
      });
      this.chartRef.yAxes.each((axis: am5xy.Axis<am5xy.AxisRenderer>) => {
        axis.data.setAll(data.yAxisData);
      });
      this.chartRef.series.each((se: am5xy.XYSeries) => {
        se.data.setAll(this.data);
      });
    }
  }
}
