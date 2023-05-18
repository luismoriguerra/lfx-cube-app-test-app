// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { PivotConfig, Query, ResultSet } from '@cubejs-client/core';
import { CubeService } from '@app/shared/services/cube.service';
import { InsightsFilters } from '@app/shared/services/filter.service';
import { Percent } from '@amcharts/amcharts5';
import { BarChartConfig } from 'lfx-insights';
import { CubeFilters } from '../../helpers/utils';

let granularity;
export const forksSeriesQuery = (filters: CubeFilters): Query => {
  const { projectId, dateRange } = filters || {};

  granularity = filters.granularity;
  const query: Query = {
    measures: ['Activities.count'],
    timeDimensions: [
      {
        dimension: 'Activities.timestamp',
        granularity,
        dateRange: dateRange as any
      }
    ],
    segments: ['Activities.fork'],
    filters: [],
    limit: 1000
  };

  if (projectId && query.filters) {
    query.filters.push({
      member: 'Activities.activity_tenant_id',
      operator: 'equals',
      values: [projectId]
    });
  }

  return query;
};

export const forkPivotConfig: PivotConfig = {
  x: ['Activities.timestamp' + granularity],
  y: ['measures'],
  fillMissingDates: true
  // joinDateRange: false
};

export function getForkSeries$(cubeService: CubeService, filterObj: InsightsFilters, limit = 0) {
  return cubeService.multipleTimeSeries$(
    forksSeriesQuery({
      dateRange: filterObj.periods?.currentPeriod,
      projectId: filterObj.project,
      hideBots: filterObj.hideBots,
      granularity: filterObj.granularity
    }),
    forkResultsetToChart(limit)
  );
}

const forkResultsetToChart =
  (limit = 0) =>
  (resultSet: ResultSet<any>) => {
    const resultSeries = resultSet.series(forkPivotConfig);

    if (!resultSeries || !resultSeries.length) {
      return [];
    }

    let series = resultSeries[0].series.map(forkToChartDateTime);
    const validateSeries = series.filter((s) => s.value > 0);
    if (limit && validateSeries.length > limit) {
      series = series.filter((s) => s.value > 0);
      const step = Math.floor(series.length / limit);
      const newSeries = [];
      for (let i = 0; i < limit; i++) {
        const start = i * step;
        const end = (i + 1) * step;
        const max = series.slice(start, end).reduce((prev, current) => (prev.value > current.value ? prev : current), {} as any);
        newSeries.push(max);
      }
      series = newSeries;
    }
    return series;
  };

function forkToChartDateTime(resultSetSeriesRow: { x: string; value: number }) {
  const newSeriesPoint = {
    ...resultSetSeriesRow,
    value: resultSetSeriesRow.value,
    x: resultSetSeriesRow.x, // date UTC
    date: new Date(resultSetSeriesRow.x).getTime()
  };

  return newSeriesPoint;
}

export const forksChartConfig: BarChartConfig = {
  showLegend: true,
  series: [
    {
      name: 'Forks',
      valueYField: 'value',
      valueXField: 'date',
      color: '#bd6bff'
    }
  ],
  xAxis: {
    field: 'date',
    axisType: 'date'
  }
};
export const forksChartConfigMicro: BarChartConfig = {
  showLegend: false,
  barWidth: new Percent(80),
  series: [
    {
      name: 'Forks',
      valueYField: 'value',
      valueXField: 'date',
      color: '#bd6bff'
    }
  ],
  xAxis: {
    field: 'date',
    axisType: 'date'
  },
  useMicroTheme: true
};
