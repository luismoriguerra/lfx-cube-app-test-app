// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { OverviewRoutingModule } from './overview-routing.module';
import { OverviewComponent } from './containers/overview/overview.component';
import { SummaryChartsComponent } from './components/summary-charts/summary-charts.component';
import { SummaryChartsTabComponent } from './components/summary-charts-tab/summary-charts-tab.component';
import { SummaryChartsContentItemComponent } from './components/summary-charts-content-item/summary-charts-content-item.component';
import { BestPracticesScoreComponent } from './components/best-practices-score/best-practices-score.component';
import { BestPracticesDetailsComponent } from './components/best-practices-details/best-practices-details.component';
import { MetricDetailsComponent } from './components/metric-details/metric-details.component';
import { OrganizationLeaderboardComponent } from './components/organization-leaderboard/organization-leaderboard.component';
import { ContributorLeaderboardComponent } from './components/contributor-leaderboard/contributor-leaderboard.component';
import { ContributorDependencyComponent } from './components/contributor-dependency/contributor-dependency.component';
import { WorkTimeDistributionComponent } from './components/work-time-distribution/work-time-distribution.component';
import { ActiveDaysComponent } from './components/active-days/active-days.component';
import { GeographicalDistributionComponent } from './components/geographical-distribution/geographical-distribution.component';
import { EmbedReportSummaryComponent } from './components/embed-report-summary/embed-report-summary.component';

@NgModule({
  declarations: [
    OverviewComponent,
    SummaryChartsComponent,
    SummaryChartsTabComponent,
    SummaryChartsContentItemComponent,
    BestPracticesScoreComponent,
    BestPracticesDetailsComponent,
    MetricDetailsComponent,
    OrganizationLeaderboardComponent,
    ContributorLeaderboardComponent,
    ContributorDependencyComponent,
    WorkTimeDistributionComponent,
    ActiveDaysComponent,
    GeographicalDistributionComponent,
    EmbedReportSummaryComponent
  ],
  imports: [CommonModule, OverviewRoutingModule, SharedModule, ReactiveFormsModule, FormsModule]
})
export class OverviewModule {}
