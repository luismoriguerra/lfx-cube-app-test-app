// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5hierarchy from '@amcharts/amcharts5/hierarchy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, Input, NgZone, OnChanges, OnDestroy, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { ChartService } from '@app/shared/services/chart.service';
import { FilterService } from '@app/shared/services/filter.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { bubbleChartConfig } from 'lfx-insights';
import { switchMap, tap } from 'rxjs';
import { ChartBaseComponent } from '@app/shared/classes/chart-base.component';
import { ActiveDaysData } from '@app/shared/cubejs/metrics/active-days/activeDays';
import { DownloadService } from '@app/shared/services/download.service';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'lfx-force-directed-chart',
  templateUrl: './force-directed-chart.component.html',
  styleUrls: ['./force-directed-chart.component.scss']
})
export class ForceDirectedChartComponent extends ChartBaseComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() public config!: bubbleChartConfig;
  @Input() public chartName!: string;
  @Input() public isLoading: boolean = false;

  public innerLoading: boolean = false;
  private root!: am5.Root;
  private series!: am5hierarchy.ForceDirected;
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
      // this.changeData();
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

      // Create wrapper container
      const container = root.container.children.push(
        am5.Container.new(root, {
          width: am5.percent(100),
          height: am5.percent(100),
          layout: root.verticalLayout
        })
      );

      // Create series
      const series = container.children.push(
        am5hierarchy.ForceDirected.new(root, {
          valueField: 'value',
          categoryField: 'name',
          childDataField: 'children',
          idField: 'name',
          draggable: false,
          downDepth: 1,
          topDepth: 1,
          maxRadius: 146,
          minRadius: 56,
          manyBodyStrength: -10,
          centerStrength: 0.5,
          linkWithStrength: 0,
          wheelable: true
        })
      );

      series.circles.template.setAll({
        templateField: 'nodeSettings'
      });

      series.labels.template.setAll({
        text: '[bold;fontSize: 18px]{value}[/]\n [fontSize: 16px]{category}',
        textAlign: 'center',
        fill: am5.color('#fff'),
        fontFamily: 'Open Sans'
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

      this.series = series;
      this.updateSeriesData();
      this.root = root;
    });
  }

  public updateSeriesData() {
    const data = this.config.data;
    const series = this.series;

    this.setAllData(series, data);
  }

  public setAllData(series: am5hierarchy.ForceDirected, data: ActiveDaysData[] = []) {
    if (data.every((e) => !e.value)) {
      series.data.setAll([]);
      return;
    }
    series.data.setAll([
      {
        name: '',
        children: data.map((element) => ({
          name: element.name,
          value: element.value,
          nodeSettings: {
            fill: am5.color(element.color)
          }
        }))
      }
    ]);
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
    this.filters$
      .pipe(
        untilDestroyed(this),
        tap(() => (this.innerLoading = true)),
        switchMap((filters) => this.chartService.getChartData(this.chartName, filters).pipe(untilDestroyed(this)))
      )
      .subscribe(
        (data: ActiveDaysData[]) => {
          this.innerLoading = false;
          this.setAllData(this.series, data);
          this.downloadService.updateReadToDownload(
            this.chartName,
            data.map(({ color, ...rest }) => rest)
          );
        },
        () => {
          this.innerLoading = false;
        }
      );
  }
}
