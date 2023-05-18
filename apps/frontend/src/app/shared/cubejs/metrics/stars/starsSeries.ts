// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

/* eslint-disable @typescript-eslint/naming-convention */
import { PivotConfig, Query, ResultSet } from '@cubejs-client/core';
import { LineChartConfig } from 'lfx-insights';
import { CubeService } from '@app/shared/services/cube.service';
import { InsightsFilters } from '@app/shared/services/filter.service';
import { CubeFilters } from '../../helpers/utils';
import { cubeActivities } from '../../cubes/Activities';

let granularity;
export const starsSeries = (filters: CubeFilters, limit = 1000): Query => {
  const { dateRange, projectId } = filters || {};

  granularity = filters.granularity;
  const query: Query = {
    measures: [cubeActivities.measures.starCount],
    timeDimensions: [
      {
        dimension: cubeActivities.dimensions.timestamp,
        granularity,
        dateRange: dateRange as any
      }
    ],
    segments: [],
    filters: [],
    limit
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
// INFO: Comes from Playground
const pivotConfig: PivotConfig = {
  x: [cubeActivities.dimensions.timestamp + granularity],
  y: ['measures'],
  fillMissingDates: true
};

export function getStarSeries$(cubeService: CubeService, filters: InsightsFilters, limit = 0) {
  return cubeService.multipleTimeSeries$(
    starsSeries({
      dateRange: filters.periods?.currentPeriod,
      projectId: filters.project,
      granularity: filters.granularity
    }),
    resultsetToChart(limit)
  );
}

const resultsetToChart =
  (limit = 0) =>
  (resultSet: ResultSet<any>) => {
    const resultSeries = resultSet.series(pivotConfig);

    if (!resultSeries || !resultSeries.length) {
      return [];
    }

    let series = resultSeries[0].series.map(chartDateTime);
    const validateSeries = series.filter((item) => item.value > 0);
    // divide series in groups of 5 and from each get the highest value
    if (limit && validateSeries.length > limit) {
      const seriesGroups = [];
      for (let i = 0; i < series.length; i += limit) {
        seriesGroups.push(series.slice(i, i + limit));
      }

      series = seriesGroups.map((group) => {
        const max = group.reduce((prev, current) => (prev.value > current.value ? prev : current));
        return max;
      });
    }

    return series;
  };

function chartDateTime(resultSetSeriesRow: { x: string; value: number }) {
  //  "resultSetSeriesRow": {
  //   "value": 1,
  //   "x": "2023-04-03T00:00:00.000"
  // },
  const newSeriesPoint = {
    ...resultSetSeriesRow,
    date: new Date(resultSetSeriesRow.x).getTime()
  };

  return newSeriesPoint;
}

export const starsChartConfig: LineChartConfig = {
  showLegend: true,
  series: [
    {
      field: 'value',
      name: 'stars',
      color: '#ff3185',
      bullets: true
    }
  ],
  xAxis: {
    field: 'date',
    axisType: 'date'
  },
  type: 'smooth'
};

export const starsChartMicroThemeConfig: LineChartConfig = {
  ...starsChartConfig,
  useMicroTheme: true,
  showLegend: false,
  series: [
    {
      field: 'value',
      name: 'stars',
      color: '#ff3185',
      bullets: false
    }
  ]
};
