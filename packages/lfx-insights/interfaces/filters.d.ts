// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Project } from './project';

export const enum DateFilterEnum {
  M3 = '3 Months',
  M6 = '6 Months',
  M12 = '12 Months',
  Y2 = '2 Years',
  ALL = 'All Time',
}

export const enum DateRangesEnum {
  today = 'Today',
  yesterday = 'Yesterday',
  last7 = 'Last 7 Days',
  last15 = 'Last 15 Days',
  last30 = 'Last 30 Days',
  lastMonth = 'Last Month',
  lastQuarter = 'Last Quarter',
  last2Quarters = 'Last 2 Quarters',
  lastYear = 'Last Year',
  last2Years = 'Last 2 Years',
  last5Years = 'Last 5 Years',
  allTime = 'All Time',
  custom = 'Custom',
}

export const enum GranularityEnum {
  day = 'day',
  week = 'week',
  month = 'month',
  quarter = 'quarter',
  year = 'year',
}

export interface Filters {
  dateFilters: DateFilterEnum;
  project?: Project;
  repositories: string[];
  repositoryTags: string[];
}
