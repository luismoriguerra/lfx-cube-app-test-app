// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { DATE_RANGE_DEFAULT } from '@app/shared/utils/cubejs-helpers';
import { PivotConfig, Query, ResultSet } from '@cubejs-client/core';
import { LineChartConfig } from 'lfx-insights';
import { CubeService } from '@app/shared/services/cube.service';
import { InsightsFilters } from '@app/shared/services/filter.service';
import _ from 'lodash';
import { cubeActivities } from '../../cubes/Activities';
import { CubeFilters } from '../../helpers/utils';

// Cube Query
let granularity;
export const issuesSeries = (filters: CubeFilters): Query => {
  const { dateRange, projectId } = filters || {};

  granularity = filters.granularity;
  const query: Query = {
    segments: [cubeActivities.segments.issues_only],
    filters: [],
    measures: [cubeActivities.measures.count],
    dimensions: [cubeActivities.dimensions.type],
    timeDimensions: [
      {
        dimension: cubeActivities.dimensions.timestamp,
        dateRange: dateRange || DATE_RANGE_DEFAULT,
        granularity
      }
    ],
    order: {
      [cubeActivities.dimensions.timestamp]: 'asc'
    }
  };

  // TODO: cube no implemented
  // if (hideBots && query.segments) {
  //   query.segments.push(cubeIssues.segments.non_bots);
  // }

  if (projectId && query.filters) {
    query.filters.push({
      member: cubeActivities.dimensions.tenant_id,
      operator: 'equals',
      values: [projectId]
    });
  }

  return query;
};

// Chart Config
export const issuesSeriesPivotConfig: PivotConfig = {
  x: [`${cubeActivities.dimensions.timestamp}.${granularity}`],
  y: ['measures', cubeActivities.dimensions.type],
  fillMissingDates: true
};

export function getIssuesSeries$(cubeService: CubeService, filterObj: InsightsFilters, limit = 0) {
  return cubeService.multipleTimeSeries$(
    issuesSeries({
      dateRange: filterObj.periods?.currentPeriod,
      projectId: filterObj.project,
      hideBots: filterObj.hideBots,
      granularity: filterObj.granularity
    }),
    issuesSeriesResultsetToChart(limit)
  );
}

// Cube result to amchart
const issuesSeriesResultsetToChart =
  (limit = 0) =>
  (resultSet: ResultSet<any>) => {
    const resultSeries = resultSet.series(issuesSeriesPivotConfig);

    if (!resultSeries || !resultSeries.length) {
      return [];
    }

    let series = _.flatten(resultSeries.map((s) => s.series.map((se) => toChartDateTime(se, s.key))));
    // divide series in groups of 5 and from each get the highest value
    if (limit) {
      const seriesLength = series.length;
      const groupSize = Math.ceil(seriesLength / limit);
      const newSeries = [];
      for (let i = 0; i < seriesLength; i += groupSize) {
        const group = series.slice(i, i + groupSize);
        const max = group.reduce((prev, current) => (prev.closed > current.opened ? prev : current));
        newSeries.push(max);
      }
      series = newSeries;
    }

    return series;
  };

// {open: number, closed: number}
function toChartDateTime(cubePivotRow: { value: number; x: string }, key: string) {
  return {
    opened: key.indexOf('issues-opened') >= 0 ? cubePivotRow.value : 0,
    closed: key.indexOf('issues-closed') >= 0 ? cubePivotRow.value : 0,
    date: new Date(cubePivotRow.x).getTime()
  };
}

export const issuesChartConfig: LineChartConfig = {
  showLegend: true,
  series: [
    {
      field: 'opened',
      name: 'Open',
      color: '#c292db',
      bullets: true
    },
    {
      field: 'closed',
      name: 'Closed',
      color: '#0039b8',
      bullets: true
    }
  ],
  xAxis: {
    field: 'date',
    axisType: 'date'
  },
  type: 'smooth'
};

export const issuesChartConfigMicro: LineChartConfig = {
  useMicroTheme: true,
  series: [
    {
      field: 'opened',
      name: 'Open',
      color: '#c292db',
      bullets: false
    },
    {
      field: 'closed',
      name: 'Closed',
      color: '#0039b8',
      bullets: false
    }
  ],
  xAxis: {
    field: 'date',
    axisType: 'date'
  },
  type: 'smooth'
};

// Final Query Example
// {
//   "measures": [
//     "Issues.count"
//   ],
//   "timeDimensions": [
//     {
//       "dimension": "Issues.issue_time",
//       "granularity": "week",
//       "dateRange": "Last year"
//     }
//   ],
//   "order": [
//     [
//       "Issues.issue_time",
//       "asc"
//     ]
//   ],
//   "filters": [
//     {
//       "member": "Issues.project_id",
//       "operator": "equals",
//       "values": [
//         "a0941000002wBz4AAE"
//       ]
//     }
//   ],
//   "dimensions": [
//     "Issues.issue_state"
//   ],
//   "limit": 5000
// }
