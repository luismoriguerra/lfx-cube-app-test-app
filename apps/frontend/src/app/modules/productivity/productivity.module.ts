// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { ProductivityRoutingModule } from './productivity-routing.module';
import { ProductivityComponent } from './containers/productivity/productivity.component';
import { EffortByPullRequestBatchSizeComponent } from './components/effort-by-pull-request-batch-size/effort-by-pull-request-batch-size.component';
import { EngagementGapComponent } from './components/engagement-gap/engagement-gap.component';
import { CommitsPerDayComponent } from './components/commits-per-day/commits-per-day.component';
import { WorkTimeDistributionComponent } from './components/work-time-distribution/work-time-distribution.component';
import { NewContributorsComponent } from './components/new-contributors/new-contributors.component';
import { DriftingAwayContributorsComponent } from './components/drifting-away-contributors/drifting-away-contributors.component';

@NgModule({
  declarations: [
    ProductivityComponent,
    EffortByPullRequestBatchSizeComponent,
    EngagementGapComponent,
    CommitsPerDayComponent,
    WorkTimeDistributionComponent,
    NewContributorsComponent,
    DriftingAwayContributorsComponent
  ],
  imports: [CommonModule, ProductivityRoutingModule, SharedModule]
})
export class ProductivityModule {}
