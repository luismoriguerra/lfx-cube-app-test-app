// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Injectable } from '@angular/core';
import { heatChartData } from '@app/modules/overview/components/work-time-distribution/chart-data';

import { Observable, of } from 'rxjs';
import { ChartNames } from 'lfx-insights';

import { buildFailureRateBarChartData } from '../mock-data/build-failure-rate';
import { buildFrequencyLineChartData } from '../mock-data/build-frequency';
import { pullRequestSizeBreakdownData } from '../mock-data/pull-request-size-breakdown';
import { timeToMergePRData } from '../mock-data/time-to-merge-pr';
import { commitsPerDayMock } from '../mock-data/chart-commits';
import { workTimeDistributionBarData } from '../mock-data/productivity';
import { averageWaitTimeBarData } from '../mock-data/velocity';
import { getContributorsSeries$ } from '../cubejs/metrics/contributors/ContributorsSeries';
import { getCommitsSeries$ } from '../cubejs/metrics/commits/CommitSeries';
import { getIssuesSeries$ } from '../cubejs/metrics/issues/IssuesSeries';
import { getPullRequestsSeries$ } from '../cubejs/metrics/code-change-sets/pullRequestsSeries';
import { getForkSeries$ } from '../cubejs/metrics/forks/ForkSeries';
import { getStarSeries$ } from '../cubejs/metrics/stars/starsSeries';
import { getActiveDaysData$ } from '../cubejs/metrics/active-days/activeDays';
import { contributionsEngagementDataExample } from '../mock-data/chart-engagement-gap';
import { getGeographicalDistribution$ } from '../cubejs/metrics/geographical-distribution';
import { InsightsFilters } from './filter.service';
import { CubeService } from './cube.service';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  public constructor(private cubeService: CubeService) {}

  public getChartData(chartName: string, filterObj: InsightsFilters): Observable<any> {
    switch (chartName) {
      case ChartNames.CommitsPerDayLineChart:
        return of(commitsPerDayMock);
      case ChartNames.WorkTimeDistribution:
        return of(heatChartData);
      case ChartNames.WorkTimeDistributionBar:
        return of(workTimeDistributionBarData);
      case ChartNames.AverageWaitTime1stReview:
        return of(averageWaitTimeBarData);
      case ChartNames.TimeToMergePR:
        return of(timeToMergePRData);
      case ChartNames.BuildFrequencyLineChart:
        return of(buildFrequencyLineChartData);
      case ChartNames.PullRequestSizeBreakdown:
        return of(pullRequestSizeBreakdownData);
      case ChartNames.BuildFailureRateBarChart:
        return of(buildFailureRateBarChartData);
      case ChartNames.engagementGapChart:
        return of(contributionsEngagementDataExample);
      case ChartNames.ContributorsFull:
        return getContributorsSeries$(this.cubeService, filterObj);
      case ChartNames.ContributorsMini:
      case ChartNames.SummaryContributors:
        return getContributorsSeries$(this.cubeService, filterObj);
      case ChartNames.CommitsFull:
        return getCommitsSeries$(this.cubeService, filterObj);
      case ChartNames.CommitsMini:
        return getCommitsSeries$(this.cubeService, filterObj);
      case ChartNames.IssuesFull:
        return getIssuesSeries$(this.cubeService, filterObj);
      case ChartNames.IssuesMini:
        return getIssuesSeries$(this.cubeService, filterObj);
      case ChartNames.PullRequestsFull:
        return getPullRequestsSeries$(this.cubeService, filterObj);
      case ChartNames.PullRequestsMini:
        return getPullRequestsSeries$(this.cubeService, filterObj);
      case ChartNames.ForksFull:
        return getForkSeries$(this.cubeService, filterObj);
      case ChartNames.ForksMini:
        return getForkSeries$(this.cubeService, filterObj);
      case ChartNames.ContributorsByCountry: // playground demo
        return getGeographicalDistribution$({
          projectId: filterObj.project || '',
          dateRange: filterObj.periods?.currentPeriod || ['', ''],
          previousDateRange: filterObj.periods?.previousPeriod || ['', '']
        });
      case ChartNames.StarsFull:
        return getStarSeries$(this.cubeService, filterObj);
      case ChartNames.StarsMini:
        return getStarSeries$(this.cubeService, filterObj);
      case ChartNames.ActiveDaysChart:
        return getActiveDaysData$(this.cubeService, filterObj);
    }

    // INFO: default for demo, remove after demo
    return of(commitsPerDayMock);
  }
}
