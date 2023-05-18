// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableConfig, TableNames } from '@app/core/models/table.model';
import { contributorsMetricsForDropdown, getContributorsLeaderboard } from '@app/shared/cubejs/metrics/contributor-leaderboard/contributorsLeaderboardMetrics';

import { FilterService, InsightsFilters } from '@app/shared/services/filter.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'lfx-contributor-leaderboard',
  templateUrl: './contributor-leaderboard.component.html',
  styleUrls: ['./contributor-leaderboard.component.scss']
})
export class ContributorLeaderboardComponent implements OnInit, AfterViewInit {
  @ViewChild('numberTemplate') private numberTemplate!: TemplateRef<any>;
  @ViewChild('nameTemplate') private nameTemplate!: TemplateRef<any>;
  @ViewChild('githubNameTemplate') private githubNameTemplate!: TemplateRef<any>;
  @ViewChild('commitsTemplate') private commitsTemplate!: TemplateRef<any>;
  @ViewChild('totalTemplate') private totalTemplate!: TemplateRef<any>;

  public tableConfiguration = new TableConfig();
  public tableRecords: any[] = [];
  public isLoading = true;
  public metrics = contributorsMetricsForDropdown;
  public selectedMetric = contributorsMetricsForDropdown[0];
  public tableName = TableNames.contributorLeaderboard;

  public total: number;
  public contributorsCommitVariation: number;
  public contributorsCommitVariationCategory: string;
  public contributorsCommitFullChartDescription: string;
  public previousPeriod: any = [];
  public isExporting = false;
  public previousFilters: InsightsFilters;
  public variation = 0;

  public constructor(public elementRef: ElementRef, private filterService: FilterService) {}

  public ngOnInit() {
    this.filterService.filter$.pipe(untilDestroyed(this)).subscribe((filters) => {
      this.previousFilters = filters;
      this.getLeaderboardTable({ filters, metric: this.selectedMetric.value });
    });
  }

  public async getLeaderboardTable({ filters, metric }: { filters: InsightsFilters; metric: string }) {
    this.isLoading = true;
    this.tableConfiguration.isLoading = true;

    const { totalCurrent, totalPrevious, deltaPercentage, currentList } = await getContributorsLeaderboard({
      metric,
      tenantId: filters.project,
      dateRange: filters.periods?.currentPeriod,
      previousDateRange: filters.periods?.previousPeriod
    });
    // console.log(`DEBUG: (${metric}, ${filters.project}, ${filters.periods?.currentPeriod}, ${filters.periods?.previousPeriod})
    // --> (${totalCurrent}, ${totalPrevious}, ${deltaPercentage}, ${currentList})`);
    this.tableRecords = currentList;
    this.total = totalCurrent;
    this.variation = deltaPercentage;

    this.isLoading = false;
    this.tableConfiguration.isLoading = false;
  }

  public async updateSelectedMetric(newMetric: any) {
    this.selectedMetric = newMetric;
    this.tableConfiguration.columns[2].title = newMetric.label;

    this.getLeaderboardTable({ filters: this.previousFilters, metric: this.selectedMetric.value });
  }

  public ngAfterViewInit(): void {
    this.tableConfiguration = {
      sortedBy: 'Rank',
      columns: [
        {
          title: 'Rank',
          key: 'rank',
          columnCssClass: 'justify-center text-center',
          headerCssClass: 'justify-center text-center !font-arial',
          width: '10%',
          template: this.numberTemplate,
          sortable: true
        },
        {
          title: 'Contributor',
          key: 'username',
          columnCssClass: '',
          headerCssClass: '',
          width: '49%',
          template: this.githubNameTemplate
        },
        {
          title: this.selectedMetric.label,
          key: 'count',
          columnCssClass: 'justify-center text-center',
          headerCssClass: 'justify-center text-center',
          width: '20%',
          template: this.commitsTemplate
        },
        {
          title: 'Total',
          key: 'share',
          columnCssClass: 'justify-center text-center',
          headerCssClass: 'justify-center text-center',
          width: '20%',
          template: this.totalTemplate
        }
      ]
    };
  }

  public exportAsCSV() {
    // TODO: needs to be implemented again
    // this.isExporting = true;
    // // const additionalValues: AdditionalValues = { selectedMetric: this.selectedMetric, total: this.total, limit: undefined };
    // this.tableService.getTableData(this.tableName, this.filterService.filter$.value, additionalValues).subscribe((data) => {
    //   this.downloadService.downloadCSV(
    //     this.tableName,
    //     data.map(({ contributorId: _, ...rest }: any) => rest)
    //   );
    //   this.isExporting = false;
    // });
  }
}
