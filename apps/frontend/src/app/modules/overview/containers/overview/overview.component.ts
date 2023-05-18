// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component } from '@angular/core';
import { FilterService } from '@app/shared/services/filter.service';
import { DateRange } from '@cubejs-client/core';
import { DateFilterEnum } from 'lfx-insights';

@Component({
  selector: 'lfx-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {
  public dateRange: DateRange;
  public hideBots: boolean = true;
  public constructor(private filterService: FilterService) {}

  public changeData(): void {
    this.filterService.applyFilter({
      dateFilters: DateFilterEnum.ALL,
      repositories: [],
      repositoryTags: []
    });
  }

  public filterDateSelectedChange(event: any) {
    this.dateRange = event;
  }

  public filterHideBotsChange(hideBots: any) {
    this.hideBots = hideBots;
  }
}
