// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

/* eslint-disable @typescript-eslint/naming-convention */
export const cubeActivities = {
  dimensions: {
    type: 'Activities.type',
    timestamp: 'Activities.timestamp',
    username: 'Activities.username',
    objectMemberUsername: 'Activities.objectMemberUsername',
    objectMemberId: 'Activities.objectMemberId',
    platform: 'Activities.platform',
    sourceId: 'Activities.sourceId',
    channel: 'Activities.channel',
    tenant_id: 'Activities.activity_tenant_id',
    memberId: 'Activities.memberId',
    isContribution: 'Activities.isContribution'
  },
  measures: {
    count: 'Activities.count',
    starActivity: 'Activities.starActivity',
    unstarActivity: 'Activities.unstarActivity',
    starCount: 'Activities.starCount'
  },
  segments: {
    issues_only: 'Activities.issues_only',
    stars: 'Activities.stars',
    fork: 'Activities.fork',
    contributions_only: 'Activities.contributions_only',
    comment_activites: 'Activities.comment_activites',
    commits_activites: 'Activities.commits_activites',
    contributions_activites: 'Activities.contributions_activites',
    issues_activites: 'Activities.issues_activites',
    pull_request_activites: 'Activities.pull_request_activites'
  }
};
