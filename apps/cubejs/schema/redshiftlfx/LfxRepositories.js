// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

// repository_id                                                   |url                                       |description                                                                                                                                                    |project_id        |project_slug|short_name             |
// ----------------------------------------------------------------+------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------+------------------+------------+-----------------------+
// be818e3b5841f2d4c7a3d151db01844eb401e2cb6fea5caa70a7e36c0a8275eb|https://github.com/communitybridge/easycla|The Contributor License Agreement (CLA) service of the Linux Foundation lets project contributors read, sign, and submit contributor license agreements easily.|a092M00001IV7AiQAL|easycla     |communitybridge/easycla|
// 5f01a3e6fb9a2bd0da2f8832153418940896c8d5f0775e34dfd3510096a6be3e|https://github.com/graphql/easycla        |Test repo for setting up EasyCLA, the tool we'll use to manage specification membership sigs                                                                   |a092M00001G4R8CQAV|gql         |graphql/easycla        |

cube(`LfxRepository`, {
  sql: `SELECT
    repository_id,
    url,
    description,
    project_id,
    project_slug,
    short_name
  FROM repository`,

  joins: {},

  measures: {},

  dimensions: {
    repositoryId: {
      sql: `repository_id`,
      type: `string`,
      primaryKey: true,
    },

    url: {
      sql: `url`,
      type: `string`,
    },

    description: {
      sql: `description`,
      type: `string`,
    },

    projectId: {
      sql: `project_id`,
      type: `string`,
    },

    projectSlug: {
      sql: `project_slug`,
      type: `string`,
    },

    shortName: {
      sql: `short_name`,
      type: `string`,
    },
  },
  dataSource: "redshiftlfx",
});
