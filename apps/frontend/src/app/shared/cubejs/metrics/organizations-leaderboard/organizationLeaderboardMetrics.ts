// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { calculatePercentageChange, getPercentageOfRounded } from '@app/shared/utils/cubejs-helpers';
import { gql } from '@apollo/client/core';
import { graphqlClient } from '@app/shared/services/cube-graphql';

// INFO: this will be moved to a npm library
export const ORG_LEADERBOARD_METRICS: { [key: string]: string } = {
  ['Contributions']: 'metric_contributor_contributions',
  ['Contributors']: 'metric_contributor_contributors',
  ['Issue Commenters']: 'metric_org_issue_commenters',
  ['Issues Opened']: 'metric_org_issue_opened',
  ['Issues Closed']: 'metric_contributor_issues_closed',
  ['Pull Request Authors']: 'count_metric_pr_authors',
  ['Pull Request Comments']: 'count_metric_pr_comments',
  ['Pull Request Reviewers']: 'count_metric_pr_reviewers',
  ['Pull Request Reviews']: 'count_metric_pr_reviews',
  ['Pull Requests Closed']: 'metric_org_pr_closed',
  ['Pull Requests Merged']: 'metric_org_pr_merged',
  ['Pull Requests Opened']: 'metric_org_pr_opened'
  // TODO: enable onces we have proper commit data
  // ['Commits']: 'metric_org_commits',
  // ['Committers']: 'metric_org_committers'
};

export const orgLeaderboardForDropdown = Object.keys(ORG_LEADERBOARD_METRICS).map((key) => ({
  label: key,
  value: ORG_LEADERBOARD_METRICS[key]
}));

type OrgLeaderboardRow = {
  id: string;
  name: string;
  logo: string;
  count: number;
  previousCount: number;
  percentage: number;
};

interface OrganizationLeaderboardResponse {
  totalCurrent: number;
  totalPrevious: number;
  percentage: number;
  orgList: Array<OrgLeaderboardRow>;
  lowerCountPercentage: number;
}

export async function getOrganizationLeaderboard({
  metric = 'count_pr_activities',
  tenantId = 'ccff5355-cf54-40a1-9a2e-8e4a447ae73a',
  dateRange = ['2023-01-01', '2023-05-30'],
  previousDateRange = ['2022-01-01', '2022-12-28']
} = {}): Promise<OrganizationLeaderboardResponse> {
  const orgLeadQuery = gql`
    query CubeQuery(
      $tenantIds: [String]!
      $dateRange: [String!]!
      $previousDateRange: [String!]!
    ) {
      total_current: cube(
        where: {
          activities: {
            activity_tenant_id: { in: $tenantIds }
            timestamp: { inDateRange: $dateRange }
          }
          organizations: { name: { set: true } }
        }
      ) {
        activities {
          count: ${metric}
        }
      }
      total_previous: cube(
        where: {
          activities: {
            activity_tenant_id: { in: $tenantIds }
            timestamp: { inDateRange: $previousDateRange }
          }
          organizations: { name: { set: true } }
        }
      ) {
        activities {
          count: ${metric}
        }
      }
      orgs_current: cube(
        where: {
          activities: {
            activity_tenant_id: { in: $tenantIds }
            timestamp: { inDateRange: $dateRange }
          }
          organizations: { name: { set: true } }
        }
      ) {
        activities(orderBy: { ${metric}: desc }) {
          count: ${metric}
        }
        organizations {
          id
          name
          logo
        }
      }
      orgs_previous: cube(
        where: {
          activities: {
            activity_tenant_id: { in: $tenantIds }
            timestamp: { inDateRange: $previousDateRange }
          }
          organizations: { name: { set: true } }
        }
      ) {
        activities {
          count: ${metric}
        }
        organizations {
          id
        }
      }
    }
  `;

  const { data } = await graphqlClient.query({
    query: orgLeadQuery,
    variables: {
      tenantIds: [tenantId],
      dateRange,
      previousDateRange
    }
  });

  const totalCurrent = data.total_current[0].activities.count;
  const totalPrevious = data.total_previous[0].activities.count;

  const percentage = calculatePercentageChange(totalPrevious, totalCurrent);

  const orgsPrevious = data.orgs_previous.map((org: any) => ({
    id: org.organizations.id,
    count: org.activities.count || 0
  }));
  const orgList = data.orgs_current
    .filter((org: { activities: { count: number } }) => org.activities.count > 0)
    .map((org: { organizations: { id: any; name: any; logo: any }; activities: { count: any } }, index: number) => {
      const previousCount = orgsPrevious.find((orgPrevious: any) => orgPrevious.id === org.organizations.id)?.count || 0;

      return {
        rank: index + 1,
        id: org.organizations.id,
        name: org.organizations.name,
        logo: org.organizations.logo,
        count: org.activities.count || 0,
        previousCount,
        countDelta: org.activities.count - previousCount,
        percentage: getPercentageOfRounded(org.activities.count || 0, totalCurrent || 0)
      };
    });

  const lowerCountPercentage = getPercentageOfRounded(orgList.filter((org: any) => org.countDelta < 0).length, orgList.length);

  const response = {
    totalCurrent,
    totalPrevious,
    percentage,
    orgList,
    lowerCountPercentage
  };

  return response;
}
