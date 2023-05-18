// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { CubeFilters, getChartDescriptionByVariation, getPercentageVariationFromToNumbers, getVariationCategory } from '@app/shared/cubejs/helpers/utils';
import { CubeService } from '@app/shared/services/cube.service';
import { InsightsFilters } from '@app/shared/services/filter.service';
import { DateRange, Query } from '@cubejs-client/core';
import { DateRangesEnum } from 'lfx-insights';

export interface GithubEventsParams {
  repoName?: string;
  dateRange?: DateRangesEnum | DateRange;
  hideBots?: boolean;
}

export async function handlerSummaryChartCalculations(
  cubeService: CubeService,
  filters: InsightsFilters,
  cubeQueryFn: (params: CubeFilters, measure?: string) => Query,
  measure?: string
) {
  const { hideBots, periods, project } = filters || {};
  const { currentPeriod, previousPeriod } = periods || {};

  // Cube data
  const totalRequest = cubeService.getNumber(
    cubeQueryFn(
      {
        hideBots,
        dateRange: currentPeriod,
        projectId: project
      },
      measure
    )
  );
  const totalPreviousPRequest = cubeService.getNumber(
    cubeQueryFn(
      {
        hideBots,
        dateRange: previousPeriod,
        projectId: project
      },
      measure
    )
  );

  const [total, totalPreviousP] = await Promise.all([totalRequest, totalPreviousPRequest]);

  // UI calculations
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
