// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { VelocityRoutingModule } from './velocity-routing.module';
import { VelocityComponent } from './containers/velocity/velocity.component';
import { LeadTimeComponent } from './components/lead-time/lead-time.component';
import { LeadTimeByPrComponent } from './components/lead-time-by-pr/lead-time-by-pr.component';
import { ReviewTimeByPrComponent } from './components/review-time-by-pr/review-time-by-pr.component';
import { AverageWaitTimeComponent } from './components/average-wait-time/average-wait-time.component';
import { PerformanceMetricsComponent } from './components/performance-metrics/performance-metrics.component';
import { TimeToMergePrComponent } from './components/time-to-merge-pr/time-to-merge-pr.component';
import { BuildFrequencyComponent } from './components/build-frequency/build-frequency.component';
import { BuildFailureRateComponent } from './components/build-failure-rate/build-failure-rate.component';
import { CodeReviewEngagementComponent } from './components/code-review-engagement/code-review-engagement.component';
import { CodeReviewParticipantsComponent } from './components/code-review-participants/code-review-participants.component';

@NgModule({
  declarations: [
    VelocityComponent,
    LeadTimeComponent,
    LeadTimeByPrComponent,
    PerformanceMetricsComponent,
    TimeToMergePrComponent,
    BuildFrequencyComponent,
    BuildFailureRateComponent,
    CodeReviewEngagementComponent,
    CodeReviewParticipantsComponent,
    ReviewTimeByPrComponent,
    AverageWaitTimeComponent
  ],
  imports: [CommonModule, VelocityRoutingModule, SharedModule]
})
export class VelocityModule {}
