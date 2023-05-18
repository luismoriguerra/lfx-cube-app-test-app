// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

// id                                  |name       |
// ------------------------------------+-----------+
// c3e2c6ec-76a3-4778-a096-37955f3bff51|crowd.dev-2|
// a628131c-c910-46b7-8d56-1d8928943626|Community1 |
// fb27ff62-3ddc-46a0-9bf4-972b4c1db608|Uros Test  |
// 2c6ac1bd-a302-44e1-b6ba-79ef8b2a5167|crowd.dev  |                                                                                                                          |200-1000     |Growth|2023-04-03 02:55:46.255 -0500|false        |2023-04-03 02:55:45.243 -0500|2023-04-17 17:00:00.158 -0500|         |a9768a86-2673-4c0f-ad4b-da0da4e4e59e|a9768a86-2673-4c0f-ad4b-da0da4e4e59e|false      |           |                      |                    |discover_potential_contributors|
// ...

cube(`Tenants`, {
  sql: `SELECT id,name FROM tenants`,

  joins: {},

  preAggregations: {
    main: {
      dimensions: [
        TenantsRepositories.tenantId,
        CUBE.name,
        TenantsRepositories.repoUrl        
      ],
      indexes: {
        rollup_join_idx: {
          columns: [
            TenantsRepositories.repoUrl
          ]
        }
      }
    },
  },

  measures: {
    count: {
      type: `count`,
      drillMembers: [id, name],
    },
  },

  dimensions: {
    id: {
      sql: `id`,
      type: `string`,
      primaryKey: true,
    },

    name: {
      sql: `name`,
      type: `string`,
    },
  },
});
