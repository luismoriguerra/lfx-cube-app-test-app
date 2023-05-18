// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

// repo_url                                        |tenantId                            |platform|id                                  |
// ------------------------------------------------+------------------------------------+--------+------------------------------------+
// https://github.com/communitybridge/easycla      |ccff5355-cf54-40a1-9a2e-8e4a447ae73a|github  |96dc045e-71cc-4576-a9bb-f635735048e4|
// https://github.com/keshari1arya/aro-hotel       |a628131c-c910-46b7-8d56-1d8928943626|github  |558a0632-7b78-4343-8d46-fc8872ddbaa2|
// https://github.com/keshari1arya/aws-microservice|a628131c-c910-46b7-8d56-1d8928943626|github  |558a0632-7b78-4343-8d46-fc8872ddbaa2|
// https://github.com/keshari1arya/Cover-letter    |a628131c-c910-46b7-8d56-1d8928943626|github  |558a0632-7b78-4343-8d46-fc8872ddbaa2|
// ...

cube(`TenantsRepositories`, {
  sql: `SELECT
    jsonb_array_elements(settings->'repos')->>'url' AS repo_url,
    "tenantId",
    platform,
    id
  FROM integrations`,

  joins: {},

  measures: {},

  dimensions: {
    repoUrl: {
      sql: `repo_url`,
      type: `string`,
    },

    tenantId: {
      sql: `"tenantId"`,
      type: `string`,
    },

    platform: {
      sql: `platform`,
      type: `string`,
    },

    id: {
      sql: `id`,
      type: `string`,
      primaryKey: true,
    },
  },
});
