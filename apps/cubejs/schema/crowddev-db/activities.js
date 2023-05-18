// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

/**
 * Docs
 *
 * contributionUrl: url field can be of the form https://github.com/<repo>/pull/<id> or  https://github.com/<repo>/pull/<id>#issuecomment-<id>, so in order to have a original url we need to remove the fragment part
 *
 * Notes:
 * Graphql doesn't support Segments, so in order to allow static filters, we need to create them as metrics with filters
 */

const org_contributions_types = [
  "issues-closed",
  "issues-opened",
  "issue-comment",
  "pull_request-closed",
  "pull_request-merged",
  "pull_request-opened",
  "pull_request-reviewed",
  "pull_request-comment",
  "pull_request-review-thread-comment",
];

cube(`Activities`, {
  sql: `
  SELECT
    id,
    type,
    timestamp,
    username,
    "objectMemberUsername",
    "objectMemberId",
    platform,
    "sourceId",
    channel,
    "tenantId",
    "memberId",
    "url",
    "isContribution",
    SPLIT_PART(url, '#', 1) as "contributionUrl"
  FROM activities
  `,

  joins: {
    MemberOrganizations: {
      sql: `${CUBE}."memberId" = ${MemberOrganizations}."memberId"`,
      relationship: `many_to_one`,
    },
    Members: {
      sql: `${CUBE}."memberId" = ${Members}.id`,
      relationship: `many_to_one`,
    },
  },

  preAggregations: {
    contrlead: {
      measures: [
        Activities.count_metric_contributions,
        Activities.metric_contributor_contributions,
        // Activities.metric_contributor_issue_comments,
        // Activities.metric_contributor_issues,
        // Activities.metric_contributor_prs,
        // Activities.metric_contributor_prs_merged,
        // Activities.metric_contributor_pr_review_comments,
      ],
      dimensions: [
        Activities.activity_tenant_id,
        Activities.username,
        Members.logo_url,
      ],
      refreshKey: {
        every: `1 day`,
        updateWindow: `7 day`,
        incremental: true,
      },
      partitionGranularity: `quarter`,
      timeDimension: Activities.timestamp,
      granularity: `day`,
    },
    issuesByMonth: {
      measures: [Activities.count],
      dimensions: [Activities.type],
      segments: [Activities.issues_only],
      timeDimension: Activities.timestamp,
      granularity: `month`,
    },
  },

  segments: {
    star: {
      sql: `${CUBE}.type = 'star'`,
    },
    fork: {
      sql: `${CUBE}.type = 'fork'`,
    },
    contributions_only: {
      sql: `${CUBE}."isContribution" = true`,
    },
    comment_activites: {
      sql: `${CUBE}.type IN ('issue-comment', 'pull_request-comment', 'pull_request-review-thread-comment')`,
    },
    commits_activites: {
      sql: `${CUBE}.type = 'commits'`,
    },
    contributions_activites: {
      sql: `${CUBE}.type LIKE 'issue%' OR ${CUBE}.type LIKE 'pull_request-%'`,
    },
    issues_activites: {
      sql: `${CUBE}.type LIKE 'issue%'`,
    },
    pull_request_activites: {
      sql: `${CUBE}.type LIKE 'pull_request-%'`,
    },
    issues_only: {
      sql: `${CUBE}.type = 'issues-opened' OR ${CUBE}.type = 'issues-closed'`,
    },
  },

  measures: {
    count: {
      type: `count`,
    },
    count_pr_activities: {
      type: `count`,
      filters: [
        {
          sql: `${CUBE}.type in ('pull_request-closed', 'pull_request-comment','pull_request-merged','pull_request-opened','pull_request-review-thread-comment','pull_request-reviewed')`,
        },
      ],
    },
    count_metric_pr_authors: {
      type: `count`,
      filters: [{ sql: `${CUBE}.type in ('pull_request-opened')` }],
    },
    count_metric_pr_reviewers: {
      sql: `${CUBE}."memberId"`,
      type: `countDistinct`,
      filters: [{ sql: `${CUBE}.type in ('pull_request-reviewed')` }],
    },
    count_metric_pr_reviews: {
      type: `count`,
      filters: [
        {
          sql: `${CUBE}.type in ('pull_request-reviewed')`,
        },
      ],
    },
    count_metric_pr_comments: {
      type: `count`,
      filters: [
        {
          sql: `${CUBE}.type in ('pull_request-comment','pull_request-review-thread-comment')`,
        },
      ],
    },
    metric_contributor_contributions: {
      type: `count`,
      filters: [
        {
          sql: `${CUBE}.type in ('issue-comment','issues-closed','issues-opened','pull_request-closed','pull_request-comment','pull_request-merged','pull_request-opened','pull_request-review-thread-comment','pull_request-reviewed')`,
        },
      ],
    },
    metric_contributor_contributors: {
      type: `count`,
      filters: [
        {
          sql: `${CUBE}.type in (
          'issue-comment','issues-closed','issues-opened','pull_request-closed','pull_request-comment','pull_request-merged','pull_request-opened','pull_request-review-thread-comment','pull_request-reviewed','committed-commit','co-authored-commit','authored-commit')`,
        },
      ],
    },
    metric_org_issue_commenters: {
      type: `count`,
      filters: [
        {
          sql: `${CUBE}.type in ('issue-comment')`,
        },
      ],
    },
    metric_org_issue_opened: {
      type: `count`,
      filters: [
        {
          sql: `${CUBE}.type in ('issues-opened')`,
        },
      ],
    },
    metric_contributor_issues_closed: {
      type: `count`,
      filters: [
        {
          sql: `${CUBE}.type in ('issues-closed')`,
        },
      ],
    },
    metric_org_pr_closed: {
      type: `count`,
      filters: [
        {
          sql: `${CUBE}.type in ('pull_request-closed')`,
        },
      ],
    },
    metric_org_pr_merged: {
      type: `count`,
      filters: [
        {
          sql: `${CUBE}.type in ('pull_request-merged')`,
        },
      ],
    },
    metric_org_pr_opened: {
      type: `count`,
      filters: [
        {
          sql: `${CUBE}.type in ('pull_request-opened')`,
        },
      ],
    },
    metric_org_commits: {
      type: `count`,
      filters: [
        {
          sql: `${CUBE}.type in ('committed-commit','co-authored-commit','authored-commit')`,
        },
      ],
    },
    metric_org_committers: {
      type: `count`,
      filters: [
        {
          sql: `${CUBE}.type in ('committed-commit')`,
        },
      ],
    },
    metric_contributor_pr_comments: {
      type: `count`,
      filters: [
        {
          sql: `${CUBE}.type = 'pull_request-comment'`,
        },
      ],
    },
    count_metric_contributions: {
      type: `count`,
      filters: [
        {
          sql: `${CUBE}.type in (${org_contributions_types.map(
            (type) => `'${type}'`
          )}) `,
        },
      ],
    },
    count_metric_issue_commenters: {
      type: `count`,
      filters: [
        {
          sql: `${CUBE}.type in ('issue-comment')`,
        },
      ],
    },
    starActivity: {
      sql: `id`,
      filters: [
        {
          sql: `${CUBE}.type = 'star'`,
        },
      ],
      type: `countDistinct`,
    },
    unstarActivity: {
      sql: `id`,
      filters: [
        {
          sql: `${CUBE}.type = 'unstar'`,
        },
      ],
      type: `countDistinct`,
    },
    starCount: {
      sql: `${starActivity} - ${unstarActivity}`,
      type: `number`,
    },
  },

  dimensions: {
    id: {
      sql: `id`,
      type: `string`,
      primaryKey: true,
    },

    type: {
      sql: `type`,
      type: `string`,
    },

    timestamp: {
      sql: `timestamp`,
      type: `time`,
    },

    username: {
      sql: `username`,
      type: `string`,
    },

    objectMemberUsername: {
      sql: `"objectMemberUsername"`,
      type: `string`,
    },

    objectMemberId: {
      sql: `"objectMemberId"`,
      type: `number`,
    },

    platform: {
      sql: `platform`,
      type: `string`,
    },

    sourceId: {
      sql: `"sourceId"`,
      type: `string`,
    },

    channel: {
      sql: `channel`,
      type: `string`,
    },

    activity_tenant_id: {
      sql: `${CUBE}."tenantId"`,
      type: `string`,
    },

    memberId: {
      sql: `"memberId"`,
      type: `string`,
    },

    isContribution: {
      sql: `"isContribution"`,
      type: `boolean`,
    },
  },
});
