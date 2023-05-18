// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { CubeService } from '@app/shared/services/cube.service';
import { InsightsFilters } from '@app/shared/services/filter.service';
import { DateRange, Query, TableColumn } from '@cubejs-client/core';
import { DateRangesEnum, GranularityEnum } from 'lfx-insights';

export interface CubeFilters {
  projectId?: string;
  projectName?: string;
  repositoryUrl?: string;
  dateRange?: DateRangesEnum | DateRange;
  hideBots?: boolean;
  granularity?: GranularityEnum;
}

export function getDisplayedColumns(tableColumns: TableColumn[]): string[] {
  const queue = tableColumns;
  const columns = [];

  while (queue.length) {
    const column = queue.shift();
    if (column && column.dataIndex) {
      columns.push(column.dataIndex);
    }
    if (column && column.children && column.children.length) {
      column.children.map((child) => queue.push(child));
    }
  }

  return columns;
}

export function flattenColumns(columns: TableColumn[] = []): any {
  return columns.reduce((memo, column) => {
    const titles = flattenColumns(column.children);
    return [...memo, ...(titles.length ? titles.map((title: string) => column.shortTitle + ', ' + title) : [column.shortTitle])];
  }, [] as any);
}

export function subtractOneYear(startDate: string, endDate: string): [string, string] {
  const d1 = new Date(startDate);
  const d2 = new Date(endDate);

  d1.setFullYear(d1.getFullYear() - 1);
  d2.setFullYear(d2.getFullYear() - 1);

  return [d1.toISOString().substring(0, 10), d2.toISOString().substring(0, 10)];
}

export function getPreviousPeriod(startDate: string, endDate: string): [string, string] {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const periodDuration = end.getTime() - start.getTime() + 24 * 60 * 60 * 1000;

  const previousPeriodStart = new Date(start);
  previousPeriodStart.setTime(previousPeriodStart.getTime() - periodDuration);

  const previousPeriodEnd = new Date(end);
  previousPeriodEnd.setTime(previousPeriodEnd.getTime() - periodDuration);

  return [previousPeriodStart.toISOString().substring(0, 10), previousPeriodEnd.toISOString().substring(0, 10)];
}

export function formateDate(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export async function handlerDiffCalculations(
  cubeService: CubeService,
  filters: InsightsFilters,
  cubeQueryFn: (params: CubeFilters, measure?: string) => Query,
  measure?: string
) {
  const { hideBots, periods, project } = filters || {};
  const { currentPeriod, previousPeriod } = periods || {};

  const total = await cubeService.getNumber(
    cubeQueryFn(
      {
        hideBots,
        dateRange: currentPeriod,
        projectId: project
      },
      measure
    )
  );
  const totalPreviousP = await cubeService.getNumber(
    cubeQueryFn(
      {
        hideBots,
        dateRange: previousPeriod,
        projectId: project
      },
      measure
    )
  );

  const variation = getPercentageVariationFromToNumbers(totalPreviousP, total);
  const variationCategory = getVariationCategory(variation);
  const fullChartDescription = getChartDescriptionByVariation(variation);

  return {
    total,
    totalPreviousP,
    variation,
    variationCategory,
    fullChartDescription
  };
}

export function getPercentageVariationFromToNumbers(from: number, to: number): number {
  if (from === 0 && to === 0) {
    return 0;
  }

  if (from === 0) {
    return 100;
  }

  let variation = Math.round(((to - from) / from) * 100);

  if (isNaN(variation)) {
    variation = 0;
  }

  if (!isFinite(variation)) {
    variation = 0;
  }

  return variation;
}

export function getVariationCategory(variation = 0) {
  if (variation > 0) {
    return 'positive';
  } else if (variation === 0) {
    return 'zero';
  }
  return 'negative';
}

export function getChartDescriptionByVariation(variation = 0) {
  if (variation > 0) {
    return ` increased by ${variation}%`;
  } else if (variation === 0) {
    return ` remained the same as`;
  }

  return ` decreased by ${Math.abs(variation)}%`;
}
