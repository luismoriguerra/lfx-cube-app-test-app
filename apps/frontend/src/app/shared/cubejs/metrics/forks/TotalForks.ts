// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT
import { Query } from '@cubejs-client/core';
import { CubeFilters } from '../../helpers/utils';

export const totalForksQuery = (filters: CubeFilters): Query => {
  const { projectId, dateRange } = filters || {};

  const query: Query = {
    measures: ['Activities.count'],
    timeDimensions: [
      {
        dimension: 'Activities.timestamp',
        dateRange: dateRange as any
      }
    ],
    segments: ['Activities.fork'],
    filters: []
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
