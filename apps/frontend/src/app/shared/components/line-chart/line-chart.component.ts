// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import * as am5 from '@amcharts/amcharts5';
import { TimeUnit } from '@amcharts/amcharts5/.internal/core/util/Time';
import * as am5xy from '@amcharts/amcharts5/xy';
import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, Input, NgZone, OnChanges, OnDestroy, OnInit, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { ChartBaseComponent } from '@app/shared/classes/chart-base.component';
import { ChartService } from '@app/shared/services/chart.service';
import { DownloadService } from '@app/shared/services/download.service';
import { FilterService } from '@app/shared/services/filter.service';
import { createChart, createChartRoot, createSeriesTarget, createTooltip, createXAxis, createYAxis, mapAnnotations } from '@app/shared/utils/chart-helpers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { GranularityEnum, LineChartConfig, LineSeriesSettings } from 'lfx-insights';
import { switchMap, tap } from 'rxjs';

/**
 *
 * INFO:
 * To configure a new chart, you need to review te next files
 * packages/lfx-insights/interfaces/charts.d.ts
 * apps/frontend/src/app/shared/services/chart.service.ts
 */

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'lfx-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent extends ChartBaseComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() public config!: LineChartConfig;
  @Input() public chartName!: string;

  public annotations: any = null;
  public isLoading = false;
  public noDate = false;
  private root!: am5.Root;
  private chartRef!: am5xy.XYChart;
  private data: any[] = []; // TODO: change this to a standardized data structure
  private noDateFoundModal: am5.Modal;

  public constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private zone: NgZone,
    private chartService: ChartService,
    public changeDetectorRef: ChangeDetectorRef,
    public filterService: FilterService,
    private downloadService: DownloadService
  ) {
    super(changeDetectorRef, filterService);

    // this.createAnnotations();
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
    this.browserOnly(() => {
      // this.initChart();
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
    if (this.noDateFoundModal && this.noDateFoundModal.isOpen()) {
      this.noDateFoundModal.close();
    }
    const root = createChartRoot(this.chartName, this.config.useMicroTheme);
    const chart = createChart(root);
    const yAxis = createYAxis(root, chart, { max: this.config.max, label: this.config.yAxisName });

    if (this.config.useMicroTheme) {
      chart.plotContainer.set('wheelable', false);
      chart.zoomOutButton.set('forceHidden', true);
    }
    const granularity = this.getGranularity();
    // TODO: need to modify this to handle different time formats or if the series uses category instead of time
    const xAxis = createXAxis(root, chart, granularity);

    // Create series
    this.config.series.forEach((seriesSetting: LineSeriesSettings) => {
      this.createSeries(root, chart, xAxis, yAxis, seriesSetting, granularity);
    });

    // Add legend
    if (this.config.showLegend) {
      // createLegend(root, chart);
    }

    // Add cursor
    chart.set('cursor', am5xy.XYCursor.new(root, {}));
    this.chartRef = chart;

    this.root = root;
    this.checkNoDataFound(chart);
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
        this.data = data.buckets ? data.buckets : data;
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
      this.chartRef.xAxes.each((axis: am5xy.Axis<am5xy.AxisRenderer>) => {
        if (this.config.xAxis?.axisType !== 'category') {
          (axis as am5xy.DateAxis<am5xy.AxisRenderer>).set('baseInterval', {
            timeUnit: granularity as TimeUnit,
            count: 1
          });
        }
        axis.data.setAll([]);
        axis.data.setAll(this.data);
      });

      this.chartRef.series.each((se: am5xy.XYSeries) => {
        createTooltip(this.chartRef.root, this.chartRef, se, granularity);
        se.data.setAll([]);
        se.data.setAll(this.data);
      });
    }
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
    xAxis: am5xy.DateAxis<am5xy.AxisRenderer>,
    yAxis: am5xy.ValueAxis<am5xy.AxisRenderer>,
    settings: LineSeriesSettings,
    granularity: GranularityEnum
  ): void {
    const series = chart.series.push(
      am5xy.SmoothedXLineSeries.new(root, {
        name: settings.name,
        xAxis,
        yAxis,
        valueYField: settings.field,
        valueXField: this.config.xAxis.axisType,
        stroke: am5.color(settings.color || '#ff3185'),
        locationX: 0
      })
    );

    series.strokes.template.setAll({});
    series.strokes.template.setAll({
      strokeWidth: 2
    });

    if (settings.bullets) {
      series.bullets.setAll([]);
      series.bullets.push((...parmas) => {
        const [, se, dataItem] = parmas;
        const dataContext = dataItem.dataContext as any;
        const valueField = (se as any).get('valueYField');
        if (!dataContext[valueField] || (dataItem.uid === se.dataItems[0].uid && se.dataItems.length > 1)) {
          return;
        }
        return am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            radius: 6,
            strokeWidth: 2,
            fill: am5.color('#fff'),
            stroke: am5.color(settings.color || '#ff3185')
          }),
          locationX: 0
        });
      });
    }
    if (this.config.targetValue) {
      // adding the dashed line
      createSeriesTarget(yAxis, series, this.config.targetValue);
    }
    createTooltip(root, chart, series, granularity);
    // Create modal for a "no data" note
    this.noDateFoundModal = am5.Modal.new(root, {
      content: 'No data to display'
    });
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    series.events.on('datavalidated', (ev) => {
      if (this.config.useMicroTheme || this.isLoading) {
        return;
      }
      if (ev.target.data.length < 1 || this.noDataFound) {
        this.chartRef.children.each((child) => {
          child.set('forceHidden', true);
        });
        self.noDate = true;
        this.noDateFoundModal.open();
      } else if (ev.target.data.length > 1 && !this.noDataFound) {
        this.chartRef.children.each((child) => {
          child.set('forceHidden', false);
        });
        self.noDate = false;
        this.noDateFoundModal.close();
      }
    });
    series.data.setAll([]);
    series.data.setAll(this.data);
    series.appear(1000);
  }

  // TODO: IMPLEMENT THIS
  // private createAnnotations(): void {
  //   // creating fake fields for the annotation blocks
  //   this.data.forEach((data) => {
  //     this.config.series.forEach((series: LineSeriesSettings, idx: number) => {
  //       if (this.annotations && this.annotations[idx]) {
  //         data[`${series.field}_annotation`] = 'none';
  //       }
  //     });
  //   });

  //   this.config.series.forEach((lineSeries: LineSeriesSettings) => {
  //     if (lineSeries.annotationOptions) {
  //       const seriesRowIdx = this.getDataLocation(lineSeries.annotationOptions.horizontalPosition, this.data);
  //       this.data[seriesRowIdx][`${lineSeries.field}_annotation`] = 'block';
  //     }
  //   });
  // }

  // compute for the index of the row data where to put the label
  private getDataLocation(position: 'start' | 'center' | 'end', data: any[]): number {
    let rowIdx: number = 0;
    switch (position) {
      case 'start':
        // getting the row index at the first 25% mark of the rows
        rowIdx = Math.floor(data.length * 0.25);
        break;
      case 'center':
        // getting the row index at the 50% mark of the rows
        rowIdx = Math.floor(data.length * 0.5);
        break;
      default:
        // getting the row index at the first 75% mark of the rows
        rowIdx = Math.floor(data.length * 0.75);
    }

    return rowIdx;
  }
}
