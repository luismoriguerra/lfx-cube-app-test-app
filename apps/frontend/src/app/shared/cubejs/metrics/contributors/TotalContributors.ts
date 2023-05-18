// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Query } from '@cubejs-client/core';

import { CubeFilters } from '../../helpers/utils';

export const totalContributors = (filters: CubeFilters): Query => {
  const { dateRange, projectId } = filters || {};

  const query: Query = {
    measures: ['SummaryContributors.count'],
    timeDimensions: [
      {
        dimension: 'SummaryContributors.lastActivity',
        dateRange
      }
    ],
    filters: []
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
