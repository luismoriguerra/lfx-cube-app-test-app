// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { DATE_RANGE_DEFAULT, CROWDDEV_LINUX_FOUNDATION_PROJECT_ID } from '@app/shared/utils/cubejs-helpers';
import { PivotConfig, Query, ResultSet } from '@cubejs-client/core';
import { CubeService } from '@app/shared/services/cube.service';
import { InsightsFilters } from '@app/shared/services/filter.service';
import { LineChartConfig } from 'lfx-insights';
import { CubeFilters } from '../../helpers/utils';
import { cubeCrowdPullRequestsOverview } from '../../cubes/CrowdPullRequestsOverview';

// Cube Query
let granularity;
export const pullRequestSeries = (filters: CubeFilters): Query => {
  const { dateRange } = filters || {};
  granularity = filters.granularity;

  const query: Query = {
    segments: [],
    filters: [
      {
        member: cubeCrowdPullRequestsOverview.dimensions.tenant_id,
        operator: 'equals',
        values: [CROWDDEV_LINUX_FOUNDATION_PROJECT_ID]
      }
    ],
    measures: [
      cubeCrowdPullRequestsOverview.measures.opened_count,
      cubeCrowdPullRequestsOverview.measures.closed_count,
      cubeCrowdPullRequestsOverview.measures.merged_count
    ],
    dimensions: [],
    timeDimensions: [
      {
        dimension: cubeCrowdPullRequestsOverview.dimensions.timestamp,
        dateRange: dateRange || DATE_RANGE_DEFAULT,
        granularity
      }
    ],
    order: {
      [cubeCrowdPullRequestsOverview.dimensions.timestamp]: 'asc'
    }
  };

  // TODO: hide bots
  // if (hideBots && query.segments) {
  //   query.segments.push(cubeCrowdPullRequestsOverview.segments.non_bots);
  // }

  // TODO: add project id as filter
  // if (projectId && query.filters) {
  //   query.filters.push({
  //     member: cubeCrowdPullRequestsOverview.dimensions.project_id,
  //     operator: 'equals',
  //     values: [projectId]
  //   });
  // }

  return query;
};

// Chart Config
export const pullRequestSeriesPivotConfig: PivotConfig = {
  x: [`${cubeCrowdPullRequestsOverview.dimensions.timestamp}.${granularity}`],
  y: ['measures'],
  fillMissingDates: true
};

export function getPullRequestsSeries$(cubeService: CubeService, filterObj: InsightsFilters, limit = 0) {
  return cubeService.multipleTimeSeries$(
    pullRequestSeries({
      dateRange: filterObj.periods?.currentPeriod,
      projectId: filterObj.project,
      hideBots: filterObj.hideBots,
      granularity: filterObj.granularity
    }),
    pullRequestSeriesResultSetToChart(limit)
  );
}

// Cube result to amchart
const pullRequestSeriesResultSetToChart =
  (limit = 0) =>
  (resultSet: ResultSet<any>) => {
    const resultSeries = resultSet.chartPivot(pullRequestSeriesPivotConfig);

    if (!resultSeries || !resultSeries.length) {
      return [];
    }

    const series: any[] = resultSeries.map(toChartDateTime);

    if (limit > 0) {
      const seriesGroups = [];
      for (let i = 0; i < series.length; i += limit) {
        seriesGroups.push(series.slice(i, i + limit));
      }
      return seriesGroups.map((group) => {
        const max = group.reduce((prev, current) => (prev.created > current.created ? prev : current));
        return max;
      });
    }

    return series;
  };
//created: number; closed: number; merged: number; date: number
function toChartDateTime(cubePivotRow: { xValues: string[]; [key: string]: any }) {
  return {
    ...cubePivotRow,
    date: new Date(cubePivotRow.xValues[0]).getTime()
  };
}

export const pullRequestsChartConfig: LineChartConfig = {
  showLegend: true,
  series: [
    {
      field: 'PullRequestsOverview.opened_count',
      name: 'Opened',
      color: '#c292db',
      bullets: true
    },
    {
      field: 'PullRequestsOverview.closed_count',
      name: 'Closed',
      color: '#0039b8',
      bullets: true
    },
    {
      field: 'PullRequestsOverview.merged_count',
      name: 'Merged',
      color: '#46b6c7',
      bullets: true
    }
  ],
  xAxis: {
    field: 'date',
    axisType: 'date'
  },
  type: 'smooth'
};

export const pullRequestsChartConfigMicro: LineChartConfig = {
  useMicroTheme: true,
  series: [
    {
      field: 'PullRequestsOverview.opened_count',
      name: 'Opened',
      color: '#c292db',
      bullets: false
    },
    {
      field: 'PullRequestsOverview.closed_count',
      name: 'Closed',
      color: '#0039b8',
      bullets: false
    },
    {
      field: 'PullRequestsOverview.merged_count',
      name: 'Merged',
      color: '#46b6c7',
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
//     "CodeChangeSets.prs_count"
//   ],
//   "timeDimensions": [
//     {
//       "dimension": "CodeChangeSets.pr_time",
//       "granularity": "day",
//       "dateRange": "Last year"
//     }
//   ],
//   "filters": [
//     {
//       "member": "CodeChangeSets.project_id",
//       "operator": "equals",
//       "values": [
//         "a0941000002wBz4AAE"
//       ]
//     }
//   ],
//   "segments": [
//     "CodeChangeSets.github_prs"
//   ],
//   "dimensions": [
//     "CodeChangeSets.action"
//   ],
//   "order": {
//     "CodeChangeSets.prs_count": "desc"
//   }
// }
