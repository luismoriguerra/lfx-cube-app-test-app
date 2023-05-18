// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { InsightsFilters } from '@app/shared/services/filter.service';
import { Component, OnInit } from '@angular/core';
import { FilterService } from '@app/shared/services/filter.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CubeService } from '@app/shared/services/cube.service';
import { totalContributors } from '@app/shared/cubejs/metrics/contributors/TotalContributors';
import { totalIssues } from '@app/shared/cubejs/metrics/issues/TotalIssues';
import { issuesChartConfig, issuesChartConfigMicro } from '@app/shared/cubejs/metrics/issues/IssuesSeries';
import { commitsChartConfig, commitsChartConfigMicro } from '@app/shared/cubejs/metrics/commits/CommitSeries';
import { contributorsConfig, contributorsMicroThemeConfig } from '@app/shared/cubejs/metrics/contributors/ContributorsSeries';
import { totalCommits } from '@app/shared/cubejs/metrics/commits/TotalCommits';
import { totalPullRequests } from '@app/shared/cubejs/metrics/code-change-sets/totalPullRequests';
import { pullRequestsChartConfig, pullRequestsChartConfigMicro } from '@app/shared/cubejs/metrics/code-change-sets/pullRequestsSeries';
import { totalForksQuery } from '@app/shared/cubejs/metrics/forks/TotalForks';
import { forksChartConfig, forksChartConfigMicro } from '@app/shared/cubejs/metrics/forks/ForkSeries';

import { starsChartConfig, starsChartMicroThemeConfig } from '@app/shared/cubejs/metrics/stars/starsSeries';
import { totalStarsQuery } from '@app/shared/cubejs/metrics/stars/totalStars';
import { handlerSummaryChartCalculations } from './summary-charts.features';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'lfx-summary-charts',
  templateUrl: './summary-charts.component.html'
})
export class SummaryChartsComponent implements OnInit {
  public summaryContentActive = 'Contributors';

  public contributorsTotal = 0;
  public contributorsTotalPreviousP = 0;
  public contributionsVariation = 0;
  public contributionsVariationCategory: string;
  public contributionsFullChartDescription: string;

  public commitsTotal: number;
  public commitsVariation: number;
  public commitsVariationCategory: string;
  public commitsFullChartDescription: string;

  public contributorsConfig = contributorsConfig;
  public contributorsMicroThemeConfig = contributorsMicroThemeConfig;
  public commitsChartConfig = commitsChartConfig;
  public commitsChartConfigMicro = commitsChartConfigMicro;

  public issuesTotal: number;
  public issuesVariation: number;
  public issuesVariationCategory: string;
  public issuesFullChartDescription: string;

  public pullRequestsTotal: number;
  public pullRequestsVariation: number;
  public pullRequestsVariationCategory: string;
  public pullRequestsFullChartDescription: string;

  public pullRequestsChartConfig = pullRequestsChartConfig;

  public pullRequestsChartConfigMicro = pullRequestsChartConfigMicro;

  public issuesChartConfig = issuesChartConfig;
  public issuesChartConfigMicro = issuesChartConfigMicro;

  public forksTotal: number;
  public forksVariation: number;
  public forksVariationCategory: string;
  public forksFullChartDescription: string;
  public forksChartConfig = forksChartConfig;
  public forksChartConfigMicro = forksChartConfigMicro;

  public starsTotal: number;
  public starsVariation: number;
  public starsVariationCategory: string;
  public starsFullChartDescription: string;
  public starsChartConfig = starsChartConfig;
  public starsChartConfigMicro = starsChartMicroThemeConfig;

  public constructor(private cubeService: CubeService, private filterService: FilterService) {}

  public ngOnInit(): void {
    this.filterService.filter$.pipe(untilDestroyed(this)).subscribe((filters) => {
      this.handleContributionsQueries(filters);
      this.handleCommitsQueries(filters);
      this.handleIssuesQueries(filters);
      this.handlePullRequestsQueries(filters);
      this.handleForksQueries(filters);
      this.handleStarsQueries(filters);
    });
  }

  public setContentActive(content: string): void {
    this.summaryContentActive = content;
  }

  public async handleContributionsQueries(filters: InsightsFilters) {
    const { total, variation, variationCategory, fullChartDescription } = await handlerSummaryChartCalculations(this.cubeService, filters, totalContributors);

    this.contributorsTotal = total;
    this.contributionsVariation = variation;
    this.contributionsVariationCategory = variationCategory;
    this.contributionsFullChartDescription = fullChartDescription;
  }

  public async handleCommitsQueries(filters: InsightsFilters) {
    const { total, variation, variationCategory, fullChartDescription } = await handlerSummaryChartCalculations(this.cubeService, filters, totalCommits);

    this.commitsTotal = total;
    this.commitsVariation = variation;
    this.commitsVariationCategory = variationCategory;
    this.commitsFullChartDescription = fullChartDescription;
  }

  public async handleIssuesQueries(filters: InsightsFilters) {
    const { total, variation, variationCategory, fullChartDescription } = await handlerSummaryChartCalculations(this.cubeService, filters, totalIssues);

    this.issuesTotal = total;
    this.issuesVariation = variation;
    this.issuesVariationCategory = variationCategory;
    this.issuesFullChartDescription = fullChartDescription;
  }

  public async handlePullRequestsQueries(filters: InsightsFilters) {
    const { total, variation, variationCategory, fullChartDescription } = await handlerSummaryChartCalculations(this.cubeService, filters, totalPullRequests);

    this.pullRequestsTotal = total;
    this.pullRequestsVariation = variation;
    this.pullRequestsVariationCategory = variationCategory;
    this.pullRequestsFullChartDescription = fullChartDescription;
  }

  public async handleForksQueries(filters: InsightsFilters) {
    const { total, variation, variationCategory, fullChartDescription } = await handlerSummaryChartCalculations(this.cubeService, filters, totalForksQuery);

    this.forksTotal = total;
    this.forksVariation = variation;
    this.forksVariationCategory = variationCategory;
    this.forksFullChartDescription = fullChartDescription;
  }

  public async handleStarsQueries(filters: InsightsFilters) {
    const { total, variation, variationCategory, fullChartDescription } = await handlerSummaryChartCalculations(this.cubeService, filters, totalStarsQuery);

    this.starsTotal = total;
    this.starsVariation = variation;
    this.starsVariationCategory = variationCategory;
    this.starsFullChartDescription = fullChartDescription;
  }
}
