// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

/* eslint-disable @typescript-eslint/naming-convention */
export const cubeCrowdPullRequestsOverview = {
  dimensions: {
    id: 'PullRequestsOverview.id',
    type: 'PullRequestsOverview.type',
    repository_url: 'PullRequestsOverview.repository_url',
    url: 'PullRequestsOverview.url',
    created_by_id: 'PullRequestsOverview.created_by_id',
    member_id: 'PullRequestsOverview.member_id',
    tenant_id: 'PullRequestsOverview.tenant_id',
    timestamp: 'PullRequestsOverview.timestamp',
    created_at: 'PullRequestsOverview.created_at',
    linesOfCode: 'PullRequestsOverview.linesOfCode',
    bucket: 'PullRequestsOverview.bucket',
    bucketId: 'PullRequestsOverview.bucketId',
    createdAt: 'PullRequestsOverview.createdAt',
    openedAt: 'PullRequestsOverview.openedAt',
    mergedAt: 'PullRequestsOverview.mergedAt',
    hours: 'PullRequestsOverview.hours'
  },
  measures: {
    activity_count: 'PullRequestsOverview.activity_count',
    opened_count: 'PullRequestsOverview.opened_count',
    closed_count: 'PullRequestsOverview.closed_count',
    comments_count: 'PullRequestsOverview.comments_count',
    merged_count: 'PullRequestsOverview.merged_count',
    contributors: 'PullRequestsOverview.contributors',
    commenters: 'PullRequestsOverview.commenters',
    pr_authors: 'PullRequestsOverview.pr_authors',
    linesTotal: 'PullRequestsOverview.linesTotal',
    hoursTotal: 'PullRequestsOverview.hoursTotal',
    hoursAvg: 'PullRequestsOverview.hoursAvg',
    totalUniquePullRequestsCount: 'PullRequestsOverview.totalUniquePullRequestsCount'
  },
  segments: {
    prs_opened: 'PullRequestsOverview.prs_opened',
    prs_closed: 'PullRequestsOverview.prs_closed',
    prs_merged: 'PullRequestsOverview.prs_merged',
    comments: 'PullRequestsOverview.comments',
    prs_types: 'PullRequestsOverview.prs_types'
  }
};
