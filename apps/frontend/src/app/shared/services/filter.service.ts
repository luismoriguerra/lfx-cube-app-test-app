// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Injectable } from '@angular/core';
import { DateRange } from '@cubejs-client/core';
import { DateRangesEnum, GranularityEnum } from 'lfx-insights';
import { BehaviorSubject, take } from 'rxjs';
import moment from 'moment';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CROWDDEV_LINUX_FOUNDATION_PROJECT_ID, DATE_RANGE_DEFAULT, getCurrentPreviousPeriodDateRanges } from '../utils/cubejs-helpers';

/**
 *
 * INFO: This needs to match with all filters in
 * 1) top-filters.component.ts
 * 2) date-range-filter.component.ts
 *
 * Types of dateFilters coming from CubeJS API
 * 1) Last Year, last Quarter, This week
 * 2) ['2020-01-01', '2020-12-31']
 *
 */
export interface InsightsFilters {
  dateFilters?: DateRangesEnum | DateRange;
  hideBots?: boolean;
  project?: string;
  repositories?: string[];
  repositoryTags?: string[];
  compare?: string;
  granularity?: GranularityEnum;
  // Info: Use it to calculate diff values between periods
  periods?: {
    currentPeriod: [string, string];
    previousPeriod: [string, string];
  };
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  public currentFilter: InsightsFilters = {
    dateFilters: DATE_RANGE_DEFAULT,
    project: CROWDDEV_LINUX_FOUNDATION_PROJECT_ID,
    hideBots: true,
    repositories: ['kubernetes/kubernetes'],
    repositoryTags: [],
    compare: 'PP',
    periods: getCurrentPreviousPeriodDateRanges(DATE_RANGE_DEFAULT),
    granularity: GranularityEnum.month
  };

  public filter$ = new BehaviorSubject<InsightsFilters>(this.currentFilter);

  public constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    // just get the query params for the initial load
    // TODO: restore after demo
    // this.activatedRoute.queryParams.pipe(take(1)).subscribe((params: Params) => {
    //   const { project, repository, dateFilters, dateRange } = params;
    //   // update the date filters if they are present
    //   if (project) {
    //     this.currentFilter.project = project;
    //   }
    //   if (repository) {
    //     this.currentFilter.repositories = [repository];
    //   }
    //   if (dateFilters) {
    //     this.currentFilter.dateFilters = dateFilters;
    //   }
    //   if (dateRange && this.currentFilter.periods) {
    //     this.currentFilter.periods.currentPeriod = dateRange;
    //   }
    // });
  }

  public applyFilter(filters: InsightsFilters) {
    this.filter$.next(filters);
    this.currentFilter = filters;

    // this.updateFilterParams();
  }

  public applyFilterPartially(filters: InsightsFilters) {
    const currentState = {
      ...this.filter$.value,
      ...filters
    };

    if (filters.dateFilters || filters.compare) {
      const periods = getCurrentPreviousPeriodDateRanges(currentState.dateFilters || DATE_RANGE_DEFAULT, currentState.compare || 'PP');
      currentState.periods = periods;
    }

    currentState.granularity = this.calculateGranularity(currentState);

    this.filter$.next(currentState);
    this.currentFilter = currentState;

    // this.updateFilterParams();
  }

  private calculateGranularity(filters: InsightsFilters): GranularityEnum {
    let granularity = GranularityEnum.week;
    if (Array.isArray(filters.dateFilters)) {
      const diffInDays = moment(filters.dateFilters[1]).diff(filters.dateFilters[0], 'day');
      const diffInMonth = moment(filters.dateFilters[1]).diff(filters.dateFilters[0], 'month');
      if (diffInDays <= 30) {
        granularity = GranularityEnum.day;
      } else if (diffInMonth <= 6) {
        granularity = GranularityEnum.week;
      } else if (diffInMonth <= 60) {
        granularity = GranularityEnum.month;
      } else {
        granularity = GranularityEnum.year;
      }
    } else {
      switch (filters.dateFilters) {
        case DateRangesEnum.today:
          granularity = GranularityEnum.day;
          break;
        case DateRangesEnum.yesterday:
          granularity = GranularityEnum.day;
          break;
        case DateRangesEnum.last7:
          granularity = GranularityEnum.day;
          break;
        case DateRangesEnum.last30:
          granularity = GranularityEnum.day;
          break;
        case DateRangesEnum.lastQuarter:
          granularity = GranularityEnum.week;
          break;
        case DateRangesEnum.last2Quarters:
          granularity = GranularityEnum.week;
          break;
        case DateRangesEnum.lastYear:
          granularity = GranularityEnum.month;
          break;
        case DateRangesEnum.last2Years:
          granularity = GranularityEnum.month;
          break;
        case DateRangesEnum.last5Years:
          granularity = GranularityEnum.year;
          break;
        case DateRangesEnum.allTime:
          granularity = GranularityEnum.year;
          break;
        default:
          granularity = GranularityEnum.month;
      }
    }
    return granularity;
  }

  private updateFilterParams() {
    const queryParams = {
      project: this.currentFilter.project,
      repository: this.currentFilter.repositories,
      dateFilters: this.currentFilter.dateFilters,
      dateRange: this.currentFilter.periods?.currentPeriod
    };

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams,
      queryParamsHandling: 'merge' // remove to replace all query params by provided
    });
  }
}
