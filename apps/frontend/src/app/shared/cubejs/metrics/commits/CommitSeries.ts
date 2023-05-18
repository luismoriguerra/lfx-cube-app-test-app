// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { PivotConfig, Query, ResultSet } from '@cubejs-client/core';
import { DATE_RANGE_DEFAULT, PROJECT_CNCF } from '@app/shared/utils/cubejs-helpers';
import { InsightsFilters } from '@app/shared/services/filter.service';
import { CubeService } from '@app/shared/services/cube.service';
import { Percent } from '@amcharts/amcharts5';
import { BarChartConfig } from 'lfx-insights';
import { cubeCommits } from '../../cubes/Commits';
import { CubeFilters } from '../../helpers/utils';
let granularity;
export const commitsSeries = (filters: CubeFilters): Query => {
  const { projectName, dateRange, hideBots } = filters || {};
  // / INFO Hardocded projectId for now
  const projectId = PROJECT_CNCF;
  granularity = filters.granularity;
  const query: Query = {
    segments: [],
    filters: [],
    measures: [cubeCommits.measures.commits_count],
    timeDimensions: [
      {
        dimension: cubeCommits.dimensions.commit_time,
        dateRange: dateRange || DATE_RANGE_DEFAULT,
        granularity
      }
    ],
    order: {
      [cubeCommits.dimensions.commit_time]: 'asc'
    }
  };

  if (hideBots && query.segments) {
    query.segments.push(cubeCommits.segments.non_bots);
  }

  if (projectId && query.filters) {
    query.filters.push({
      member: cubeCommits.dimensions.project_id,
      operator: 'equals',
      values: [projectId]
    });
  }

  if (projectName && query.filters) {
    query.filters.push({
      member: cubeCommits.dimensions.project_name,
      operator: 'equals',
      values: [projectName]
    });
  }

  return query;
};

export const commitsChartConfig: BarChartConfig = {
  showLegend: true,
  series: [
    {
      name: 'Commits',
      valueYField: 'value',
      valueXField: 'date',
      color: '#0068fa'
    }
  ],
  xAxis: {
    field: 'date',
    axisType: 'date'
  }
};
export const commitsChartConfigMicro: BarChartConfig = {
  showLegend: false,
  barWidth: new Percent(80),
  series: [
    {
      name: 'Commits',
      valueYField: 'value',
      valueXField: 'date',
      color: '#0068fa'
    }
  ],
  xAxis: {
    field: 'date',
    axisType: 'date'
  },
  useMicroTheme: true
};

const pivotConfig: PivotConfig = {
  x: ['Commits.timestamp.' + granularity],
  y: ['measures']
  // joinDateRange: false
};

export function getCommitsSeries$(cubeService: CubeService, filterObj: InsightsFilters, limit = 0) {
  return cubeService.multipleTimeSeries$(
    commitsSeries({
      dateRange: filterObj.periods?.currentPeriod,
      projectId: filterObj.project,
      hideBots: filterObj.hideBots,
      granularity: filterObj.granularity
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

    let series: any[] = resultSeries[0].series.map(chartDateTime);

    if (limit) {
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
  const newSeriesPoint = {
    ...resultSetSeriesRow,
    value: resultSetSeriesRow.value,
    x: resultSetSeriesRow.x,
    date: new Date(resultSetSeriesRow.x).getTime()
  };

  return newSeriesPoint;
}
