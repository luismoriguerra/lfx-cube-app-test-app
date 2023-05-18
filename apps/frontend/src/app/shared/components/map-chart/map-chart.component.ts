// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT
import * as am5 from '@amcharts/amcharts5';
import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  SimpleChanges
} from '@angular/core';
import { ChartBaseComponent } from '@app/shared/classes/chart-base.component';
import { ChartService } from '@app/shared/services/chart.service';
import { FilterService } from '@app/shared/services/filter.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MapChartConfig } from 'lfx-insights';
import { switchMap, tap } from 'rxjs';
import * as am5map from '@amcharts/amcharts5/map';
import { createBubbleSeries, createChartRoot, createMapChart, createPolygonSeries } from '@app/shared/utils/chart-helpers';
import { DownloadService } from '@app/shared/services/download.service';
import { GeographicalDistribution } from '@app/shared/cubejs/metrics/geographical-distribution';

/**
 *
 * INFO:
 * To configure a new chart, you need to review te next files
 * packages/lfx-insights/interfaces/charts.d.ts
 * apps/frontend/src/app/shared/services/chart.service.ts
 */
@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'lfx-map-chart',
  templateUrl: './map-chart.component.html',
  styleUrls: ['./map-chart.component.scss']
})
export class MapChartComponent extends ChartBaseComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() public config!: MapChartConfig;
  @Input() public chartName!: string;
  @Output() public readonly dataChanged: EventEmitter<any> = new EventEmitter<any>();

  public annotations: any = null;

  public isLoading = false;

  private root!: am5.Root;
  private data: any[] = [];
  private bubbleSeries!: am5map.MapPointSeries;

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
      const root = createChartRoot(this.chartName);
      const chart = createMapChart(root);

      const polygonSeries = createPolygonSeries(root, chart);

      this.bubbleSeries = createBubbleSeries(root, chart, polygonSeries, this.config);

      this.bubbleSeries.data.setAll(this.data);

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
    this.filters$
      .pipe(
        untilDestroyed(this),
        tap(() => (this.isLoading = true)),
        switchMap((filters) => this.chartService.getChartData(this.chartName, filters).pipe(untilDestroyed(this)))
      )
      .subscribe((response: any) => {
        this.data = response.countryListWithShare;

        this.downloadService.updateReadToDownload(
          this.chartName,
          this.data.map(({ id: _, ...rest }: any) => rest)
        );
        this.isLoading = false;
        this.dataChanged.emit(response);
        this.changeData();
      });
  }

  private changeData(): void {
    if (this.bubbleSeries) {
      this.bubbleSeries.data.setAll(this.data);
    }
  }
}
