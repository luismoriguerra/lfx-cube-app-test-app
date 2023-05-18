// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

/* eslint-disable @typescript-eslint/naming-convention */
export const cubeCommits = {
  dimensions: {
    commit_sha: 'Commits.commit_sha',
    commit_id: 'Commits.commit_id',
    project_id: 'Commits.project_id',
    project_name: 'Commits.project_name',
    short_name: 'Commits.short_name',
    repository_url: 'Commits.repository_url',
    role: 'Commits.role',
    is_bot: 'Commits.is_bot',
    commit_time: 'Commits.commit_time'
  },
  measures: {
    commits_count: 'Commits.commits_count',
    bots_commits_count: 'Commits.bots_commits_count',
    non_bots_commits_count: 'Commits.non_bots_commits_count',
    non_bot_commits_percentage: 'Commits.non_bot_commits_percentage'
  },
  segments: {
    only_bots: 'Commits.only_bots',
    non_bots: 'Commits.non_bots',
    only_authors: 'Commits.only_authors',
    only_co_authors: 'Commits.only_co_authors',
    only_committers: 'Commits.only_committers'
  }
};
