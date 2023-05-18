// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { PivotConfig, Query, ResultSet } from '@cubejs-client/core';
import { DATE_RANGE_DEFAULT } from '@app/shared/utils/cubejs-helpers';
import { CubeService } from '@app/shared/services/cube.service';
import { InsightsFilters } from '@app/shared/services/filter.service';
import { LineChartConfig } from 'lfx-insights';
import { CubeFilters } from '../../helpers/utils';
let granularity;
export const contributorsSeries = (filters: CubeFilters): Query => {
  const { dateRange, projectId } = filters || {};
  granularity = filters.granularity;

  const query: Query = {
    measures: ['SummaryContributors.count'],
    timeDimensions: [
      {
        dimension: 'SummaryContributors.lastActivity',
        dateRange,
        granularity
      }
    ],
    filters: [],
    limit: 5000
  };

  if (projectId && query.filters) {
    query.filters.push({
      member: 'SummaryContributors.tenantId',
      operator: 'equals',
      values: [projectId]
    });
  }

  return query;
};

// INFO: Comes from Playground
const pivotConfig: PivotConfig = {
  x: ['SummaryContributors.lastActivity.' + granularity],
  y: ['measures'],
  fillMissingDates: true
  // joinDateRange: false
};

export const contributorsByCountry = (params: CubeFilters): Query => {
  const { repositoryUrl = 'kubernetes/kubernetes', projectName, dateRange } = params || {};

  const query: Query = {
    measures: ['ContributorsByLocation.contributor_count'],
    timeDimensions: [
      {
        dimension: 'ContributorsByLocation.contributionDate',
        dateRange: dateRange || DATE_RANGE_DEFAULT
      }
    ],
    order: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'ContributorsByLocation.contributor_count': 'desc'
    },
    dimensions: ['ContributorsByLocation.countryCode', 'ContributorsByLocation.countryName'],
    filters: [
      {
        member: 'ContributorsByLocation.repository',
        operator: 'equals',
        values: [repositoryUrl]
      }
    ]
  };

  if (projectName && query.filters) {
    query.filters.push({
      member: 'ContributorsByLocation.project',
      operator: 'equals',
      values: [projectName]
    });
  }

  return query;
};

export const contributorsConfig: LineChartConfig = {
  showLegend: true,
  series: [
    {
      field: 'value',
      name: 'Contributors',
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

export const contributorsMicroThemeConfig: LineChartConfig = {
  ...contributorsConfig,
  useMicroTheme: true,
  showLegend: false,
  series: [
    {
      field: 'value',
      name: 'Contributors',
      color: '#ff3185',
      bullets: false
    }
  ]
};

export function getContributorsSeries$(cubeService: CubeService, filterObj: InsightsFilters, limit = 0) {
  return cubeService.multipleTimeSeries$(
    contributorsSeries({
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

    let series = resultSeries[0].series.map(chartDateTime);

    // divide series in groups of 5 and from each get the highest value
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
    date: new Date(resultSetSeriesRow.x).getTime()
  };

  return newSeriesPoint;
}
