// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { DATE_RANGE_DEFAULT } from '@app/shared/utils/cubejs-helpers';
import { Query } from '@cubejs-client/core';
import { cubeActivities } from '../../cubes/Activities';
import { CubeFilters } from '../../helpers/utils';

export const totalIssues = (filters: CubeFilters): Query => {
  const { dateRange, projectId } = filters || {};

  const query: Query = {
    segments: [cubeActivities.segments.issues_only],
    filters: [],
    measures: [cubeActivities.measures.count],
    dimensions: [],
    timeDimensions: [
      {
        dimension: cubeActivities.dimensions.timestamp,
        dateRange: dateRange || DATE_RANGE_DEFAULT
      }
    ]
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

// Final Query Example
// {
//   "measures": [
//     "Issues.count"
//   ],
//   "timeDimensions": [
//     {
//       "dimension": "Issues.issue_time",
//       "dateRange": "Last year"
//     }
//   ],
//   "order": {
//     "Issues.issue_time": "asc"
//   },
//   "filters": [
//     {
//       "member": "Issues.project_id",
//       "operator": "equals",
//       "values": [
//         "a0941000002wBz4AAE"
//       ]
//     }
//   ],
//   "limit": 5000
// }
