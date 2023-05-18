// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { InsightsFilters } from '@app/shared/services/filter.service';
import { DATE_RANGE_DEFAULT } from '@app/shared/utils/cubejs-helpers';
import { Query } from '@cubejs-client/core';
import { cubeActivities } from '../../cubes/Activities';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const workTimeDistributionQuery = (filter: InsightsFilters, type: string, platform: string, userPrevious: boolean = false): Query => {
  const { periods, project, repositories } = filter || {};
  const period = userPrevious ? periods?.previousPeriod : periods?.currentPeriod;

  const query: Query = {
    dimensions: [cubeActivities.dimensions.type, cubeActivities.dimensions.timestamp, cubeActivities.dimensions.tenant_id],
    timeDimensions: [
      {
        dimension: cubeActivities.dimensions.timestamp,
        dateRange: period || DATE_RANGE_DEFAULT
      }
    ],
    filters: [],
    segments: [`Activities.${type}_activites`]
  };

  if (platform !== '' && query.filters) {
    query.filters.push({
      member: cubeActivities.dimensions.platform,
      operator: 'equals',
      values: [platform]
    });
  }

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
