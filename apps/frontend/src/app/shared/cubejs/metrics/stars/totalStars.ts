// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

/* eslint-disable @typescript-eslint/naming-convention */
import { Query } from '@cubejs-client/core';
import { CubeService } from '@app/shared/services/cube.service';
import { InsightsFilters } from '@app/shared/services/filter.service';
import { CubeFilters, getPercentageVariationFromToNumbers } from '../../helpers/utils';
import { cubeActivities } from '../../cubes/Activities';

export const totalStarsQuery = (filters: CubeFilters): Query => {
  const { dateRange, projectId } = filters || {};

  const query: Query = {
    measures: [cubeActivities.measures.starCount],
    timeDimensions: [
      {
        dimension: cubeActivities.dimensions.timestamp,
        dateRange: dateRange as any
      }
    ],
    segments: [],
    filters: []
  };

  if (projectId && query.filters) {
    query.filters.push({
      member: cubeActivities.dimensions.tenant_id,
      operator: 'equals',
      values: [projectId]
    });
  }

  return query;
};

export async function getStarsTotalDiff(cubeService: CubeService, filters: InsightsFilters) {
  const currentTotalRequest = cubeService.getNumber(
    totalStarsQuery({
      dateRange: filters.periods?.currentPeriod,
      projectId: filters.project
    })
  );

  const previousTotalRequest = cubeService.getNumber(
    totalStarsQuery({
      dateRange: filters.periods?.previousPeriod,
      projectId: filters.project
    })
  );

  const [currentTotal, previousTotal] = await Promise.all([currentTotalRequest, previousTotalRequest]);

  const diffPercentage = getPercentageVariationFromToNumbers(previousTotal, currentTotal);

  return {
    currentTotal,
    previousTotal,
    diffPercentage
  };
}
