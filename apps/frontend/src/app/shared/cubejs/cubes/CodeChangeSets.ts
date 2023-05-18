// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

/* eslint-disable @typescript-eslint/naming-convention */
export const cubeCodeChangeSets = {
  dimensions: {
    pullrequest_id: 'CodeChangeSets.pullrequest_id',
    project_id: 'CodeChangeSets.project_id',
    project_name: 'CodeChangeSets.project_name',
    short_name: 'CodeChangeSets.short_name',
    repository_url: 'CodeChangeSets.repository_url',
    role: 'CodeChangeSets.role',
    action: 'CodeChangeSets.action',
    pr_type: 'CodeChangeSets.pr_type',
    is_bot: 'CodeChangeSets.is_bot',
    pr_time: 'CodeChangeSets.pr_time'
  },
  measures: {
    prs_count: 'CodeChangeSets.prs_count',
    total_prs_count: 'CodeChangeSets.total_prs_count',
    github_prs_count: 'CodeChangeSets.github_prs_count',
    gerrit_mrs_count: 'CodeChangeSets.gerrit_mrs_count',
    bots_prs_count: 'CodeChangeSets.bots_prs_count',
    non_bots_prs_count: 'CodeChangeSets.non_bots_prs_count',
    non_bot_prs_percentage: 'CodeChangeSets.non_bot_prs_percentage',
    non_bot_opened_prs_count: 'CodeChangeSets.non_bot_opened_prs_count',
    non_bot_github_opened_prs_count: 'CodeChangeSets.non_bot_github_opened_prs_count',
    non_bot_gerrit_opened_mrs_count: 'CodeChangeSets.non_bot_gerrit_opened_mrs_count',
    non_bot_merged_prs_count: 'CodeChangeSets.non_bot_merged_prs_count',
    non_bot_github_merged_prs_count: 'CodeChangeSets.non_bot_github_merged_prs_count',
    non_bot_gerrit_merged_mrs_count: 'CodeChangeSets.non_bot_gerrit_merged_mrs_count',
    merged_to_opened_ratio: 'CodeChangeSets.merged_to_opened_ratio'
  },
  segments: {
    only_bots: 'CodeChangeSets.only_bots',
    non_bots: 'CodeChangeSets.non_bots',
    github_prs: 'CodeChangeSets.github_prs',
    gerrit_mrs: 'CodeChangeSets.gerrit_mrs',
    only_authors: 'CodeChangeSets.only_authors',
    only_mergers: 'CodeChangeSets.only_mergers'
  }
};
