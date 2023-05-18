// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, Input, NgZone, OnChanges, OnDestroy, OnInit, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { ChartBaseComponent } from '@app/shared/classes/chart-base.component';
import { ChartService } from '@app/shared/services/chart.service';
import { FilterService } from '@app/shared/services/filter.service';
import { createSeriesTarget, createTooltip, createYAxis, mapAnnotations } from '@app/shared/utils/chart-helpers';
import am5themes_Micro from '@amcharts/amcharts5/themes/Micro';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BarChartConfig, ColumnSeriesSettings, GranularityEnum } from 'lfx-insights';
import { switchMap, tap } from 'rxjs';
import { Percent } from '@amcharts/amcharts5';
import { DownloadService } from '@app/shared/services/download.service';
import { TimeUnit } from '@amcharts/amcharts5/.internal/core/util/Time';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'lfx-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent extends ChartBaseComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() public config!: BarChartConfig;
  @Input() public chartName!: string;

  public annotations: any = null;
  public isLoading = false;

  private root!: am5.Root;
  private chartRef!: am5xy.XYChart;
  private data: any[] = []; // TODO: change this to a standardized data structure

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

  public ngOnInit(): void {
    this.loadData();
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
    // Chart code goes in here
    this.browserOnly(() => {});
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
    const check = this.chartRef.series.values.every((se) => {
      const valueField = (se as any).get('valueYField');
      return se.data.values.every((e: any) => !e[valueField]);
    });
    return check;
  }

  public initChart() {
    if (this.root) {
      this.root.dispose();
    }
    const root = am5.Root.new(this.chartName);
    const myTheme = am5.Theme.new(root);

    // hiding all the grid lines by default
    myTheme.rule('Grid').setAll({
      strokeOpacity: 0
    });

    root.setThemes([myTheme]);

    if (this.config.useMicroTheme) {
      root.setThemes([am5themes_Micro.new(root)]);
    }

    // remove footer logo
    // eslint-disable-next-line no-underscore-dangle
    root._logo?.children.clear();

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panY: false,
        layout: root.verticalLayout,
        maxTooltipDistance: -1
      })
    );
    const granularity = this.getGranularity();
    const xAxis = this.createXAxis(root, chart, granularity);

    const yAxis = createYAxis(root, chart, { max: this.config.max, label: this.config.yAxisName });

    if (this.config.useMicroTheme) {
      chart.plotContainer.set('wheelable', false);
      chart.zoomOutButton.set('forceHidden', true);
    }
    // Create series
    this.config.series.forEach((s: ColumnSeriesSettings) => {
      this.createSeries(root, chart, xAxis, yAxis, s, granularity);
    });

    // Add legend
    if (this.config.showLegend) {
      this.addLegend(chart, root);
    }

    // Add cursor
    chart.set('cursor', am5xy.XYCursor.new(root, {}));
    this.chartRef = chart;

    this.root = root;
    this.checkNoDataFound(this.chartRef);
  }

  public loadData(): void {
    // TODO: add hiding and showing of the loader icon
    this.filters$
      .pipe(
        untilDestroyed(this),
        tap(() => (this.isLoading = true)),
        switchMap((filters) => this.chartService.getChartData(this.chartName, filters).pipe(untilDestroyed(this)))
      )
      .subscribe((data: any) => {
        this.data = data.buckets ? data.buckets : data || [];

        if (data.observations) {
          this.annotations = data.observations;
        }
        if (data[0]?.x) {
          this.downloadService.updateReadToDownload(
            this.chartName,
            data.map(({ x: x, xValues: _, ...rest }: any) => ({
              ...rest,
              date: x.split(',')[0]
            }))
          );
        }
        this.isLoading = false;
        setTimeout(() => {
          this.initChart();
        }, 100);
      });
  }

  public getAnnotationHTML(template: string, values: any): string {
    return mapAnnotations(template, values);
  }

  private changeData(): void {
    if (this.chartRef) {
      const granularity = this.getGranularity();

      this.chartRef.xAxes.each((axis) => {
        if (this.config.xAxis?.axisType !== 'category') {
          (axis as am5xy.DateAxis<am5xy.AxisRenderer>).set('baseInterval', {
            timeUnit: granularity as TimeUnit,
            count: 1
          });
        }
        axis.data.setAll(this.data);
      });
      this.chartRef.series.each((se: am5xy.XYSeries) => {
        createTooltip(this.chartRef.root, this.chartRef, se, granularity);
        se.data.setAll(this.data);
      });
    }
  }

  private addLegend(chart: am5xy.XYChart, root: am5.Root) {
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50
      })
    );
    legend.labels.template.setAll({
      fontSize: 12,
      fontFamily: 'Open Sans, Source Sans Pro, sans-serif',
      fill: am5.color('#333333')
    });
    legend.markers.template.setAll({
      height: 15,
      width: 15
    });
    legend.markerRectangles.template.setAll({
      cornerRadiusTL: 10,
      cornerRadiusTR: 10,
      cornerRadiusBL: 10,
      cornerRadiusBR: 10
    });

    legend.data.setAll(chart.series.values);
  }

  private getGranularity() {
    let granularity = this.filterService.currentFilter.granularity ? this.filterService.currentFilter.granularity : GranularityEnum.week;
    if (this.config.xAxis?.granularity) {
      granularity = this.config.xAxis?.granularity;
    }
    return granularity;
  }

  private createSeries(
    root: am5.Root,
    chart: am5xy.XYChart,
    xAxis: am5xy.CategoryAxis<am5xy.AxisRenderer> | am5xy.DateAxis<am5xy.AxisRenderer>,
    yAxis: am5xy.ValueAxis<am5xy.AxisRenderer>,
    s: ColumnSeriesSettings,
    granularity: GranularityEnum
  ): void {
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        xAxis,
        yAxis,
        ...s,
        fill: s.color ? am5.color(s.color) : undefined,
        stacked: this.config.type === 'stacked'
      })
    );
    createTooltip(root, chart, series, granularity);
    // Create modal for a "no data" note
    const modal = am5.Modal.new(root, {
      content: 'No data to display'
    });

    series.events.on('datavalidated', (ev) => {
      if (this.config.useMicroTheme || this.isLoading) {
        return;
      }
      if (ev.target.data.length < 1 || this.noDataFound) {
        this.chartRef.children.each((child) => {
          child.set('forceHidden', true);
        });
        modal.open();
      } else if (ev.target.data.length > 1 && !this.noDataFound) {
        this.chartRef.children.each((child) => {
          child.set('forceHidden', false);
        });
        modal.close();
      }
    });
    series.data.setAll(this.data);

    series.columns.template.setAll({
      width: this.config.barWidth || new Percent(40)
    });

    if (this.config.targetValue) {
      // adding the dashed line
      createSeriesTarget(yAxis, series, this.config.targetValue);
    }
  }

  private createXAxis(
    root: am5.Root,
    chart: am5xy.XYChart,
    granularity: GranularityEnum
  ): am5xy.CategoryAxis<am5xy.AxisRenderer> | am5xy.DateAxis<am5xy.AxisRenderer> {
    const { axisType, groupData, dateFormats } = this.config.xAxis || {};

    const xRenderer = am5xy.AxisRendererX.new(root, {
      stroke: am5.color('#807f83'),
      minGridDistance: 28,
      strokeOpacity: 1,
      strokeWidth: 1
    });

    const xAxis = chart.xAxes.push(
      axisType === 'category'
        ? am5xy.CategoryAxis.new(root, {
            renderer: xRenderer,
            categoryField: 'category'
          })
        : am5xy.DateAxis.new(root, {
            renderer: xRenderer,
            maxDeviation: 0,
            markUnitChange: false,
            groupData: groupData || true,
            dateFormats: {
              day: 'MMM\ndd',
              week: 'MMM\ndd',
              month: 'MMM\nyy ',
              year: 'yyyy',
              ...(dateFormats || {})
            },
            baseInterval: {
              timeUnit: granularity as TimeUnit,
              count: 1
            }
          })
    );

    (xAxis as am5xy.DateAxis<am5xy.AxisRenderer>).get('renderer').labels.template.setAll({
      fill: am5.color('#807f83'),
      fontSize: 12,
      textAlign: 'center'
    });

    xAxis.data.setAll(this.data);

    return xAxis;
  }
}
