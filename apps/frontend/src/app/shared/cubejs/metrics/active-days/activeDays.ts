// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { PivotConfig, Query } from '@cubejs-client/core';
import { DATE_RANGE_DEFAULT, getDaysCountFromTwoDates } from '@app/shared/utils/cubejs-helpers';
import { InsightsFilters } from '@app/shared/services/filter.service';
import { CubeService } from '@app/shared/services/cube.service';
import { Observable } from 'rxjs';
import { CubeFilters, getChartDescriptionByVariation, getPercentageVariationFromToNumbers, getVariationCategory } from '../../helpers/utils';
import { cubeActiveDays } from '../../cubes/activeDays';

export const activeDaysQuery = (filters: CubeFilters): Query => {
  const { dateRange, projectId } = filters || {};

  const query: Query = {
    measures: [cubeActiveDays.measures.totalActiveDays, cubeActiveDays.measures.avgContributions],
    filters: [],
    timeDimensions: [
      {
        dimension: cubeActiveDays.dimensions.timestamp,
        dateRange: dateRange || DATE_RANGE_DEFAULT
      }
    ],
    limit: 1
  };

  if (projectId && query.filters) {
    query.filters.push({
      dimension: cubeActiveDays.dimensions.tenant_id,
      operator: 'equals',
      values: [projectId]
    });
  }

  return query;
};

export const pivotConfig: PivotConfig = {
  x: [],
  y: ['measures'],
  fillMissingDates: true
  // "joinDateRange": false
};

export async function getActiveInactiveDays(cubeService: CubeService, filters: InsightsFilters) {
  const currentActiveDaysResponse = await cubeService.getTable(
    activeDaysQuery({
      dateRange: filters.periods?.currentPeriod,
      projectId: filters.project
    }),
    pivotConfig
  );

  const { tableData: cTableData } = currentActiveDaysResponse || {};
  const [currentActiveDaysData] = cTableData;
  const currentActiveDays = currentActiveDaysData[cubeActiveDays.measures.totalActiveDays];

  return {
    currentActiveDays: Number(currentActiveDays) || 0,
    inactiveDays: getDaysCountFromTwoDates(filters.periods?.currentPeriod[0], filters.periods?.currentPeriod[1]) - Number(currentActiveDays)
  };
}

export async function getActiveDaysSummary(cubeService: CubeService, filters: InsightsFilters) {
  const currentActiveDaysResponse = await cubeService.getTable(
    activeDaysQuery({
      dateRange: filters.periods?.currentPeriod,
      projectId: filters.project
    }),
    pivotConfig
  );
  const previousActiveDaysResponse = await cubeService.getTable(
    activeDaysQuery({
      dateRange: filters.periods?.previousPeriod,
      projectId: filters.project
    }),
    pivotConfig
  );

  const { tableData: cTableData } = currentActiveDaysResponse || {};
  const [currentActiveDaysData] = cTableData;
  const currentActiveDays = currentActiveDaysData[cubeActiveDays.measures.totalActiveDays];
  const avgContributions = currentActiveDaysData[cubeActiveDays.measures.avgContributions];

  const { tableData: pTableData } = previousActiveDaysResponse || {};
  const [pActiveDaysData] = pTableData;
  const previousActiveDays = pActiveDaysData[cubeActiveDays.measures.totalActiveDays] || {};

  const variation = getPercentageVariationFromToNumbers(Number(previousActiveDays), Number(currentActiveDays));
  const variationCategory = getVariationCategory(variation);
  const fullChartDescription = getChartDescriptionByVariation(variation);

  return {
    variation,
    variationCategory,
    fullChartDescription,
    previousActiveDays: Number(previousActiveDays) || 0,
    currentActiveDays: Number(currentActiveDays) || 0,
    inactiveDays: getDaysCountFromTwoDates(filters.periods?.currentPeriod[0], filters.periods?.currentPeriod[1]) - Number(currentActiveDays),
    avgContributions: Number(avgContributions) || 0
  };
}

export interface ActiveDaysData {
  name: string;
  value: number;
  color: string;
}

export function activeDaysChartData(activeDays: number, inactiveDays: number): ActiveDaysData[] {
  return [
    {
      name: 'Active Days',
      value: activeDays,
      color: '#46b6c7'
    },
    {
      name: 'Inactive Days',
      value: inactiveDays,
      color: '#ff3185'
    }
  ];
}

export function getActiveDaysData$(cubeService: CubeService, filters: InsightsFilters): Observable<ActiveDaysData[]> {
  return new Observable((observer) => {
    getActiveInactiveDays(cubeService, filters)
      .then((data) => {
        observer.next(activeDaysChartData(data.currentActiveDays, data.inactiveDays));
        observer.complete();
      })
      .catch((error) => {
        observer.error(error);
      });
  });
}
