// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Query } from '@cubejs-client/core';
import { InsightsFilters } from '../../../services/filter.service';
import { DATE_RANGE_DEFAULT } from '../../../utils/cubejs-helpers';

export const LEAD_TIME_PR = (filter: InsightsFilters): Query => {
  const { repositories = ['kubernetes/kubernetes'], dateFilters = DATE_RANGE_DEFAULT, project = 'cncf', periods } = filter || {};
  const { currentPeriod } = periods || {};

  const dateRange = dateFilters;

  const query: Query = {
    measures: ['PullRequests.count', 'PullRequests.hoursTotal'],
    dimensions: ['PullRequests.bucket', 'PullRequests.bucketId'],
    order: [['PullRequests.bucketId', 'asc']],
    timeDimensions: [
      {
        dimension: 'PullRequests.createdAt',
        dateRange: currentPeriod || dateRange
      }
    ],
    filters: [
      {
        member: 'PullRequests.repository',
        operator: 'contains',
        values: repositories
      },
      {
        member: 'PullRequests.projectId',
        operator: 'equals',
        values: [project]
      }
    ]
  };

  return query;
};
