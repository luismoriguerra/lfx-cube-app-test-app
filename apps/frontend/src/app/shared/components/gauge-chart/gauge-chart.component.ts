// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import * as am5 from '@amcharts/amcharts5';
import * as am5radar from '@amcharts/amcharts5/radar';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, Input, NgZone, OnChanges, OnDestroy, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { ChartBaseComponent } from '@app/shared/classes/chart-base.component';
import { ChartService } from '@app/shared/services/chart.service';
import { FilterService } from '@app/shared/services/filter.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { GaugeChartConfig } from 'lfx-insights';
import { switchMap } from 'rxjs';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'lfx-gauge-chart',
  templateUrl: './gauge-chart.component.html',
  styleUrls: ['./gauge-chart.component.scss']
})
export class GaugeChartComponent extends ChartBaseComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() public config!: GaugeChartConfig;
  @Input() public chartName!: string;

  private root!: am5.Root;
  private chartRef!: am5xy.XYChart;
  private data: any[] = []; // TODO: change this to a standardized data structure

  public constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private zone: NgZone,
    private chartService: ChartService,
    public changeDetectorRef: ChangeDetectorRef,
    public filterService: FilterService
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
    this.loadData();
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
        am5radar.RadarChart.new(root, {
          panX: false,
          panY: false,
          startAngle: 180,
          endAngle: 360,
          height: this.config.height
        })
      );

      // Create axis and its renderer
      // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
      const axisRenderer = am5radar.AxisRendererCircular.new(root, {
        innerRadius: this.config.innerRadius, // -50
        strokeOpacity: 0.1
      });

      axisRenderer.labels.template.set('forceHidden', true);
      axisRenderer.grid.template.set('forceHidden', true);

      const xAxis = chart.xAxes.push(
        am5xy.ValueAxis.new(root, {
          maxDeviation: 0,
          min: 0,
          max: 100,
          strictMinMax: true,
          renderer: axisRenderer
        })
      );

      // add yes and no labels
      for (const iterator of this.config.ranges) {
        const element = xAxis.makeDataItem({
          value: iterator.value,
          endValue: iterator.endValue
        });
        xAxis.createAxisRange(element);
        const label = element.get('label') as am5xy.AxisLabelRadial;

        label.setAll({
          position: 'relative',
          forceHidden: false,
          text: `[bold]${iterator.text}[/]\n(${iterator.value}-${iterator.endValue}%)`,
          fontFamily: 'Open Sans, Source Sans Pro, sans-serif',
          fontSize: 13,
          textAlign: 'center',
          textType: 'adjusted'
        });
        element.get('axisFill')?.setAll({ visible: true, fillOpacity: 1, fill: am5.color(iterator.color) });
      }
      // Add clock hand
      // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
      const axisDataItem = xAxis.makeDataItem({
        value: this.config.value
      });

      axisDataItem.set(
        'bullet',
        am5xy.AxisBullet.new(root, {
          sprite: am5radar.ClockHand.new(root, {
            radius: am5.percent(80)
          })
        })
      );

      xAxis.createAxisRange(axisDataItem);

      axisDataItem.get('grid')?.set('visible', false);

      this.chartRef = chart;

      this.root = root;
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
    this.filters$
      .pipe(
        untilDestroyed(this),
        switchMap((filters) => this.chartService.getChartData(this.chartName, filters).pipe(untilDestroyed(this)))
      )
      .subscribe((data: any) => {
        this.data = data;
        this.changeData();
      });
  }

  private changeData(): void {
    if (this.chartRef) {
      this.chartRef.xAxes.each((axis: am5xy.Axis<am5xy.AxisRenderer>) => {
        axis.data.setAll(this.data);
      });

      this.chartRef.series.each((se: am5xy.XYSeries) => {
        se.data.setAll(this.data);
      });
    }
  }
}
