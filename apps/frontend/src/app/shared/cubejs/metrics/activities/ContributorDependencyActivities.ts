// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Query } from '@cubejs-client/core';
import { DATE_RANGE_DEFAULT } from '@app/shared/utils/cubejs-helpers';
import { InsightsFilters } from '@app/shared/services/filter.service';
import { cubeActivities } from '../../cubes/Activities';

export const contributorDependenciesActivities = (filters: InsightsFilters, type: string, userPrevious: boolean = false): Query => {
  const { periods, project, repositories } = filters || {};
  const period = userPrevious ? periods?.previousPeriod : periods?.currentPeriod;

  const query: Query = {
    order: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      [cubeActivities.measures.count]: 'desc'
    },
    dimensions: [cubeActivities.dimensions.username, cubeActivities.dimensions.memberId, 'Members.logo_url'],
    measures: [cubeActivities.measures.count],
    timeDimensions: [
      {
        dimension: cubeActivities.dimensions.timestamp,
        dateRange: period || DATE_RANGE_DEFAULT
      }
    ],
    filters: [],
    segments: [`Activities.${type}_activites`]
  };

  if (repositories && repositories.length > 0 && query.filters) {
    query.filters.push({
      member: cubeActivities.dimensions.channel,
      operator: 'contains',
      values: repositories
    });
  }

  if (project && query.filters) {
    query.filters.push({
      member: cubeActivities.dimensions.tenant_id,
      operator: 'equals',
      values: [project]
    });
  }

  return query;
};
