// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component, OnInit } from '@angular/core';
import { FilterService, InsightsFilters } from '@app/shared/services/filter.service';
import { PullRequestService } from '@app/shared/services/pull-request.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PRTimeSize } from 'lfx-insights';
import { Observable, take } from 'rxjs';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'lfx-velocity',
  templateUrl: './velocity.component.html',
  styleUrls: ['./velocity.component.scss']
})
export class VelocityComponent implements OnInit {
  public leadTimeProgress: Observable<PRTimeSize[]>;
  public constructor(private pullRequestService: PullRequestService, private filterService: FilterService) {}

  public ngOnInit(): void {
    this.filterService.filter$
      .pipe(untilDestroyed(this))
      .subscribe((filter: InsightsFilters) => (this.leadTimeProgress = this.pullRequestService.getLeadTimeByPR(filter).pipe(take(1))));
  }
}
