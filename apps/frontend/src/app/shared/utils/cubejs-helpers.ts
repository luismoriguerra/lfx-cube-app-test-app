/* eslint-disable no-case-declarations */
// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { DateRange, Filter, TimeDimensionGranularity } from '@cubejs-client/core';
import { DateRangesEnum } from 'lfx-insights';
import moment from 'moment';
import { formateDate, getPreviousPeriod, subtractOneYear } from '../cubejs/helpers/utils';

export const DATE_RANGE_DEFAULT = 'Last Year';
export const PROJECT_CNCF = 'a0941000002wBz4AAE';
export const CROWDDEV_LINUX_FOUNDATION_PROJECT_ID = 'ccff5355-cf54-40a1-9a2e-8e4a447ae73a';

export const BOT_FILTER: Filter = {
  member: 'GithubEvents.actorLogin',
  operator: 'notContains',
  values: ['bot']
};

export function getDaysCountFromTwoDates(from = '', to = '') {
  const date1 = new Date(from);
  const date2 = new Date(to);
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 0 ? 1 : diffDays;
}

export function getPreviousPeriodFromStartDateAndDiffDays(startDate = '2022-12-31', diff: number = 0): [string, string] {
  const previousEndDate = new Date(startDate);
  const previousStartDate = new Date(startDate);
  previousEndDate.setDate(previousEndDate.getDate() - 1);
  previousStartDate.setDate(new Date(startDate).getDate() - (diff + 1));

  return [previousStartDate.toISOString().split('T')[0], previousEndDate.toISOString().split('T')[0]];
}

export function getCurrentPreviousPeriodDateRanges(filterDateOption: DateRangesEnum | DateRange, compare = 'PP') {
  let dates;
  if (Array.isArray(filterDateOption)) {
    dates = {
      currentPeriod: filterDateOption,
      previousPeriod: compare === 'PP' ? getPreviousPeriod(filterDateOption[0], filterDateOption[1]) : subtractOneYear(filterDateOption[0], filterDateOption[1])
    };
    return dates;
  }

  const dateRange = getFirstAndLastDayOfDateRangeType(filterDateOption);
  const currentPeriod: [string, string] = [formateDate(dateRange.startDate), formateDate(dateRange.endDate)];
  const previousPeriod = compare === 'PP' ? getPreviousPeriod(currentPeriod[0], currentPeriod[1]) : subtractOneYear(currentPeriod[0], currentPeriod[1]);
  dates = {
    currentPeriod,
    previousPeriod
  };
  return dates;
}

function getFirstAndLastDayOfDateRangeType(filterDateOption: DateRangesEnum | string) {
  let endDate = new Date();
  let startDate = new Date();

  switch (filterDateOption) {
    case DateRangesEnum.today:
      break;
    case DateRangesEnum.yesterday:
      startDate.setDate(endDate.getDate() - 1);
      break;
    case DateRangesEnum.last7:
      startDate.setDate(endDate.getDate() - 7);
      break;
    case DateRangesEnum.last15:
      startDate.setDate(endDate.getDate() - 15);
      break;
    case DateRangesEnum.last30:
      startDate.setDate(endDate.getDate() - 30);
      break;
    case DateRangesEnum.lastQuarter:
      const lastQuarter = moment().subtract(1, 'quarter');
      startDate = lastQuarter.startOf('quarter').toDate();
      endDate = lastQuarter.endOf('quarter').toDate();
      break;
    case DateRangesEnum.last2Quarters:
      startDate = moment().subtract(2, 'quarter').startOf('quarter').toDate();
      endDate = moment().subtract(1, 'quarter').endOf('quarter').toDate();
      break;
    case DateRangesEnum.lastYear:
      const lastYear = moment().subtract(1, 'year');
      startDate = lastYear.startOf('year').toDate();
      endDate = lastYear.endOf('year').toDate();
      break;
    case DateRangesEnum.last2Years:
      startDate.setFullYear(endDate.getFullYear() - 2);
      break;
    case DateRangesEnum.last5Years:
      startDate.setFullYear(endDate.getFullYear() - 5);
      break;
    case DateRangesEnum.allTime:
      startDate.setFullYear(endDate.getFullYear() - 10);
      break;
  }

  return {
    startDate,
    endDate
  };
}

export function getGranularityBasedOnDateRange(daysTotal: number = 365): TimeDimensionGranularity {
  switch (true) {
    case daysTotal <= 30:
      return 'day';
    case daysTotal <= 90:
      return 'week';
    case daysTotal <= 365:
      return 'month';
    default:
      return 'year';
  }
}

export function calculatePercentageChange(oldValue = 1, newValue = 2) {
  if (!oldValue && !newValue) {
    return 0;
  }

  if (!oldValue) {
    return 100;
  }

  if (!newValue) {
    return -100;
  }

  if (oldValue === newValue) {
    return 0;
  }

  let diff = ((newValue - oldValue) / oldValue) * 100;
  diff = Math.round(diff * 100) / 100;

  return diff;
}

export function getPercentageOfRounded(part = 1, total = 100) {
  if (!part) {
    return 0;
  }

  if (!total) {
    return 100;
  }

  return Math.round((part / total) * 100);
}
