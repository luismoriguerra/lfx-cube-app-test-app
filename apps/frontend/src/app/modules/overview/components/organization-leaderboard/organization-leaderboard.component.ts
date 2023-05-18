// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableConfig } from '@app/core/models/table.model';
import { FilterService, InsightsFilters } from '@app/shared/services/filter.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { getOrganizationLeaderboard, orgLeaderboardForDropdown } from '@app/shared/cubejs/metrics/organizations-leaderboard/organizationLeaderboardMetrics';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'lfx-organization-leaderboard',
  templateUrl: './organization-leaderboard.component.html',
  styleUrls: ['./organization-leaderboard.component.scss']
})
export class OrganizationLeaderboardComponent implements OnInit, AfterViewInit {
  @ViewChild('numberTemplate') private numberTemplate!: TemplateRef<any>;
  @ViewChild('nameTemplate') private nameTemplate!: TemplateRef<any>;
  @ViewChild('commitsTemplate') private commitsTemplate!: TemplateRef<any>;
  @ViewChild('totalTemplate') private totalTemplate!: TemplateRef<any>;

  public tableConfiguration = new TableConfig();
  public tableName = 'Organization-leaderboard';
  public total: number = 0;
  public variation: number = 0;
  public variationCategory: string = '';
  public fullChartDescription: string = '';
  public lowerCountPercentage: number = 0;

  public metrics = orgLeaderboardForDropdown;
  public selectedMetric = orgLeaderboardForDropdown[0];

  public loadingTotal: boolean;
  public isExporting = false;
  public isLoading = true;
  public tableRecords: any[];
  public previousFilters: InsightsFilters;

  public constructor(public elementRef: ElementRef, private filterService: FilterService) {}

  public ngOnInit() {
    this.filterService.filter$.pipe(untilDestroyed(this)).subscribe((filters) => {
      this.previousFilters = filters;
      this.getOrganizationLeaderboardTableContent({ filters, metric: this.selectedMetric.value });
    });
  }

  public async getOrganizationLeaderboardTableContent({ filters, metric }: { filters: InsightsFilters; metric: string }) {
    this.isLoading = true;
    this.tableConfiguration.isLoading = true;

    const { totalCurrent, totalPrevious, percentage, orgList, lowerCountPercentage } = await getOrganizationLeaderboard({
      metric,
      tenantId: filters.project,
      dateRange: filters.periods?.currentPeriod,
      previousDateRange: filters.periods?.previousPeriod
    });
    this.tableRecords = orgList;
    this.total = totalCurrent;
    this.variation = percentage;
    this.lowerCountPercentage = lowerCountPercentage;

    this.isLoading = false;
    this.tableConfiguration.isLoading = false;
  }

  public ngAfterViewInit(): void {
    this.tableConfiguration.sortedBy = 'Rank';
    this.tableConfiguration.columns = [
      {
        title: 'Rank',
        key: 'rank',
        columnCssClass: 'justify-center text-center',
        headerCssClass: 'justify-center text-center !font-arial',
        width: '12%',
        template: this.numberTemplate,
        sortable: true
      },
      {
        title: 'Name',
        key: 'name',
        columnCssClass: '',
        headerCssClass: '',
        width: '34%',
        template: this.nameTemplate
      },
      {
        title: 'Contributions',
        key: 'count',
        columnCssClass: 'justify-center text-center',
        headerCssClass: 'justify-center text-center',
        width: '27%',
        template: this.commitsTemplate
      },
      {
        title: 'Total',
        key: 'percentage',
        columnCssClass: 'justify-center text-center',
        headerCssClass: 'justify-center text-center',
        width: '27%',
        template: this.totalTemplate
      }
    ];
  }

  public async updateSelectedMetric(newMetric: any) {
    this.selectedMetric = newMetric;
    this.tableConfiguration.columns[2].title = newMetric.label;

    this.getOrganizationLeaderboardTableContent({ filters: this.previousFilters, metric: this.selectedMetric.value });
  }

  public exportAsCSV() {
    this.isExporting = true;
  }
}
