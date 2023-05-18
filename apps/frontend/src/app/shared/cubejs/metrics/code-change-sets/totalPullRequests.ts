// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { DATE_RANGE_DEFAULT, CROWDDEV_LINUX_FOUNDATION_PROJECT_ID } from '@app/shared/utils/cubejs-helpers';
import { Query } from '@cubejs-client/core';
import { CubeFilters } from '../../helpers/utils';
import { cubeCrowdPullRequestsOverview } from '../../cubes/CrowdPullRequestsOverview';

export const totalPullRequests = (filters: CubeFilters): Query => {
  const { dateRange } = filters || {};
  const query: Query = {
    segments: [],
    filters: [
      {
        member: cubeCrowdPullRequestsOverview.dimensions.tenant_id,
        operator: 'equals',
        values: [CROWDDEV_LINUX_FOUNDATION_PROJECT_ID]
      }
    ],
    measures: [cubeCrowdPullRequestsOverview.measures.totalUniquePullRequestsCount],
    dimensions: [],
    timeDimensions: [
      {
        dimension: cubeCrowdPullRequestsOverview.dimensions.timestamp,
        dateRange: dateRange || DATE_RANGE_DEFAULT
      }
    ]
  };
  // TODO: hide bots
  // if (hideBots && query.segments) {
  //   query.segments.push(cubeCrowdPullRequestsOverview.segments.non_bots);
  // }

  // TODO: add project id as filter
  // if (projectId && query.filters) {
  //   query.filters.push({
  //     member: cubeCodeChangeSets.dimensions.project_id,
  //     operator: 'equals',
  //     values: [projectId]
  //   });
  // }

  return query;
};

// Final Query Example
// {
//   "measures": [
//     "CodeChangeSets.prs_count"
//   ],
//   "timeDimensions": [
//     {
//       "dimension": "CodeChangeSets.pr_time",
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
//   "order": {}
// }
