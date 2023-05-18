// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Query } from '@cubejs-client/core';
import { DATE_RANGE_DEFAULT, PROJECT_CNCF } from '@app/shared/utils/cubejs-helpers';
import { cubeCommits } from '../../cubes/Commits';
import { CubeFilters } from '../../helpers/utils';

export const totalCommits = (filters: CubeFilters): Query => {
  const { dateRange, hideBots } = filters || {};
  // INFO Hardocded projectId for now
  const projectId = PROJECT_CNCF;
  const query: Query = {
    segments: [],
    filters: [],
    measures: [cubeCommits.measures.commits_count],
    timeDimensions: [
      {
        dimension: cubeCommits.dimensions.commit_time,
        dateRange: dateRange || DATE_RANGE_DEFAULT
      }
    ]
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

  return query;
};
