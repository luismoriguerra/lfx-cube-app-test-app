// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { InsightsFilters } from '@app/shared/services/filter.service';
import { Query } from '@cubejs-client/core';

// TODO: remove eslint after implement filters
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const bestPracticeScore = (filter: InsightsFilters): Query => {
  const query: Query = {
    dimensions: [
      'BestPracticeScore.repositoryUrl',
      'BestPracticeScore.repositoryId',
      'BestPracticeScore.globalScore',
      'BestPracticeScore.documentationScore',
      'BestPracticeScore.licenseScore',
      'BestPracticeScore.bestPracticesScore',
      'BestPracticeScore.securityScore',
      'BestPracticeScore.legalScore'
    ],
    order: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'BestPracticeScore.repositoryId': 'asc'
    },
    filters: [
      {
        member: 'BestPracticeScore.projectId',
        operator: 'equals',
        values: ['a092M00001IV42DQAT']
      }
    ]
  };

  return query;
};
