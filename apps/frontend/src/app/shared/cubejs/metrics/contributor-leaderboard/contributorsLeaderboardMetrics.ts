// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

/* eslint-disable @typescript-eslint/naming-convention */
import { calculatePercentageChange, getPercentageOfRounded } from '@app/shared/utils/cubejs-helpers';
import { gql } from '@apollo/client/core';
import { graphqlClient } from '@app/shared/services/cube-graphql';

// INFO: this will be moved to a npm library
export const CONTRIBUTORS_LEADERBOARD_METRICS: { [key: string]: string } = {
  // ['Contributions']: 'metric_contributor_contributions',
  // ['Pull Requests']: 'metric_contributor_prs',
  // ['Comments']: 'metric_contributor_comments',
  // ['Issues']: 'metric_contributor_issues',
  // ['Issue Comments']: 'metric_contributor_issue_comments',
  // ['PRs Merged']: 'metric_contributor_prs_merged',
  // ['PR Review Comments']: 'metric_contributor_pr_review_comments'
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
};

export const contributorsMetricsForDropdown = Object.keys(CONTRIBUTORS_LEADERBOARD_METRICS).map((key) => ({
  label: key,
  value: CONTRIBUTORS_LEADERBOARD_METRICS[key]
}));

function convertToContributorLeaderboardTable(data: any) {
  const totalCurrent = data.total_current[0].activities.count;
  const totalPrevious = data.total_previous[0].activities.count;
  const deltaPercentage = calculatePercentageChange(totalPrevious, totalCurrent);
  const previousList = data.contributors_previous.map((contributor: any) => ({
    id: contributor.activities.memberId,
    count: contributor.activities.count || 0
  }));
  const currentList = data.contributors_current
    .filter((contributor: { activities: { count: number } }) => contributor.activities.count > 0)
    .map((contributor: { activities: { count: number; memberId: any; username: any }; members: { logo_url: any } }, index: number) => {
      const currentCount = contributor.activities.count || 0;
      const previousCount = previousList.find((previousListRow: any) => previousListRow.id === contributor.activities.memberId)?.count || 0;

      const diff = currentCount - previousCount;
      return {
        rank: index + 1,
        id: contributor.activities.memberId,
        username: contributor.activities.username,
        logo: contributor.members.logo_url,
        count: contributor.activities.count || 0,
        previousCount,
        countDiff: diff,
        share: getPercentageOfRounded(contributor.activities.count || 0, totalCurrent || 0)
      };
    });

  return {
    totalCurrent,
    totalPrevious,
    deltaPercentage,
    currentList
  };
}

interface ContributorRow {
  id: string;
  username: string;
  logo: string;
  count: number;
  previousCount: number;
  countDiff: number;
  share: number;
}

export async function getContributorsLeaderboard({
  metric = 'metric_contributor_comments',
  tenantId = 'ccff5355-cf54-40a1-9a2e-8e4a447ae73a',
  dateRange = ['2023-01-01', '2023-05-30'],
  previousDateRange = ['2022-01-01', '2022-12-28']
} = {}): Promise<{
  totalCurrent: number;
  totalPrevious: number;
  deltaPercentage: number;
  currentList: ContributorRow[];
}> {
  const contributorsQuery = gql`
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
        }
      ) {
        activities {
          count: ${metric}
        }
      }
      contributors_current: cube(
        where: {
          activities: {
            activity_tenant_id: { in: $tenantIds }
            timestamp: { inDateRange: $dateRange }
          }
        }
      ) {
        activities(orderBy: { ${metric}: desc }) {
          count: ${metric}
          username
          memberId
        }
        members {
         logo_url
        }
      }
      contributors_previous: cube(
        where: {
          activities: {
            activity_tenant_id: { in: $tenantIds }
            timestamp: { inDateRange: $previousDateRange }
          }
        }
      ) {
        activities {
          count: ${metric}
          memberId
        }
      }
    }
  `;

  const grahqlResponse = await graphqlClient.query({
    query: contributorsQuery,
    variables: {
      tenantIds: [tenantId],
      dateRange,
      previousDateRange
    }
  });

  const graphqlData = grahqlResponse.data;

  const { totalCurrent, totalPrevious, deltaPercentage, currentList } = convertToContributorLeaderboardTable(graphqlData);

  const response = {
    totalCurrent,
    totalPrevious,
    deltaPercentage,
    currentList
  };

  return response;
}
