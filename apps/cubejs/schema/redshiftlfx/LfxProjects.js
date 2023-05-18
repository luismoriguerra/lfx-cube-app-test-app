// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

// project_id        |description                                |name   |logo                                                                                        |repository_url                            |
// ------------------+-------------------------------------------+-------+--------------------------------------------------------------------------------------------+------------------------------------------+
// a092M00001IV7AiQAL|Staging project for Demoing EasyCLA product|EasyCLA|https://lf-master-project-logos-prod.s3.us-east-2.amazonaws.com/thelinuxfoundation-color.svg|https://github.com/communitybridge/easycla|

cube(`LfxProjects`, {
  sql: `SELECT project_id ,description ,name,logo ,repository_url FROM projects`,

  joins: {},

  measures: {
    count: {
      type: `count`,
      drillMembers: [projectId, name, description, logo, repositoryUrl],
    },
  },

  dimensions: {
    projectId: {
      sql: `project_id`,
      type: `string`,
      primaryKey: true,
    },

    description: {
      sql: `description`,
      type: `string`,
    },

    name: {
      sql: `name`,
      type: `string`,
    },

    logo: {
      sql: `logo`,
      type: `string`,
    },

    repositoryUrl: {
      sql: `repository_url`,
      type: `string`,
    },
  },
  dataSource: "redshiftlfx",
});
