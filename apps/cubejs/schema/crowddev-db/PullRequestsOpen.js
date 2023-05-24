// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT
//PullRequest Cube for Overview Page - This cube provides counts of Open, Closed and Merged PRs
cube("PullRequestsOpen", {
  sql: `
    WITH latest_merge AS (
      SELECT * FROM (
        SELECT
          *,
          ROW_NUMBER() OVER(PARTITION BY url ORDER BY merged_at DESC) AS rn
        FROM (
          SELECT 
            id,
            url, 
            ("attributes" ->> 'additions')::numeric + ("attributes" ->> 'deletions')::numeric AS lines_code,
            ("attributes" ->> 'state') AS state,  -- this one looks like a SCD type 1
            "createdAt" AS merged_at,
            "timestamp" AS updated_at
          FROM activities
          WHERE type = 'pull_request-merged'
        ) all_pr_merges
      ) pr_merges_window_fn
      WHERE rn = 1
    ), open_pr AS (
      SELECT * FROM (
        SELECT 
          *,
          ROW_NUMBER() OVER(PARTITION BY url ORDER BY created_at DESC) AS rn
        FROM (
          SELECT
            "id", -- for this Cube the primary key is the URL not the activity ID.
            "url", -- Replace with SPLIT_PART(url, '#', 1) if needed.
            "timestamp" AS updated_at,
            "channel" AS repository_url,
            "memberId" AS member_id,
            "tenantId" AS tenant_id,
            "createdAt" AS created_at,
            "createdById" AS created_by_id,
            ("attributes" ->> 'additions')::numeric + ("attributes" ->> 'deletions')::numeric AS lines_code,
            ("attributes" ->> 'state') AS state  -- this one looks like a SCD type 1
          FROM
            "activities"
          WHERE
            "type" = 'pull_request-opened'
            AND "deletedAt" is null
        ) all_pr_open
      ) pr_open_window_fn
      WHERE rn = 1
    )
    SELECT
      o.url,
      COALESCE(m.updated_at, o.updated_at) AS updated_at,
      o.repository_url,
      o.member_id,
      o.tenant_id,
      o.created_at,
      o.created_by_id,
      COALESCE(m.lines_code, o.lines_code) AS lines_code,
      m.merged_at,
      COALESCE(m.state, o.state) AS state
    FROM
      open_pr o LEFT JOIN latest_merge m ON o.url=m.url
  `,
  joins: {
    Members:{
      relationship: `many_to_one`,
      sql: `${CUBE.member_id} = ${Members.id}`
    }
  },
  dimensions: {
    // id: {
    //   sql: "id",
    //   type: "string",
    // },
    repository_url: {
      sql: "repository_url",
      type: "string",
    },
    url: {
      sql: "url",
      type: "string",
      primaryKey: true
    },
    created_by_id: {
      sql: "created_by_id",
      type: "string",
    },
    member_id: {
      sql: "member_id",
      type: "string",
    },
    tenant_id: {
      sql: "tenant_id",
      type: "string",
    },
    updated_at: {
      type: "time",
      sql: "updated_at",
    },
    created_at: {
      type: "time",
      sql: "created_at",
    },
    lines_of_code: {
      sql: `lines_code`,
      type: `number`,
    },
    bucket: {
      type: `string`,
      case: {
        when: [
          { sql: `${CUBE}.lines_code < 10`, label: `1 - 9` },
          {
            sql: `${CUBE}.lines_code >= 10 AND ${CUBE}.lines_code < 50`,
            label: `10 - 49`,
          },
          {
            sql: `${CUBE}.lines_code >= 50 AND ${CUBE}.lines_code < 100`,
            label: `50 - 99`,
          },
          {
            sql: `${CUBE}.lines_code >= 100 AND ${CUBE}.lines_code < 500`,
            label: `100 - 499`,
          },
        ],
        else: { label: `500+` },
      },
    },
    bucketId: {
      type: `number`,
      case: {
        when: [
          { sql: `${CUBE}.lines_code < 10`, label: `1` },
          {
            sql: `${CUBE}.lines_code >= 10 AND ${CUBE}.lines_code < 50`,
            label: `2`,
          },
          {
            sql: `${CUBE}.lines_code >= 50 AND ${CUBE}.lines_code < 100`,
            label: `3`,
          },
          {
            sql: `${CUBE}.lines_code >= 100 AND ${CUBE}.lines_code < 500`,
            label: `4`,
          },
        ],
        else: { label: `5` },
      },
    },
    merged_at: {
      sql: `merged_at`,
      type: `time`,
    },
    hours: {
      // this will be in hours
      type: `number`,
      sql: `(extract(epoch from ${merged_at}) - extract(epoch from ${created_at}))/3600`,
    },
  },
  measures: {
    activity_count: {
      sql: "url",
      type: `count`,
    },
    totalUniquePullRequestsCount: {
      // this will return count of unique pull requests
      sql: `${activity_count}`,
      type: `number`,
    },
    // kept for reference
    opened_count: {
      sql: "url",
      type: `countDistinct`,
      // filters: [
      //   {
      //     sql: `${CUBE}.type = 'pull_request-opened'`,
      //   },
      // ],
    },
    // TODO: add flag isClosed
    // closed_count: {
    //   sql: "url",
    //   type: `countDistinct`,
    //   filters: [
    //     {
    //       sql: `${CUBE}.type = 'pull_request-closed'`,
    //     },
    //   ],
    // },
    // comments_count: {
    //   sql: "id",
    //   type: `count`,
    //   filters: [
    //     {
    //       sql: `${CUBE}.type = 'pull_request-comment'`,
    //     },
    //   ],
    // },
    merged_count: {
      sql: "url",
      type: `count`,
      filters: [
        {
          sql: `${CUBE}.state = 'merged'`,
        },
      ],
    },
    // member_id now map 1-to-1, to the original creator
    // contributors: {
    //   sql: "member_id",
    //   type: `countDistinct`,
    // },
    // commenters: {
    //   sql: "member_id",
    //   type: `countDistinct`,
    //   filters: [
    //     {
    //       sql: `${CUBE}.type = 'pull_request-comment'`,
    //     },
    //   ],
    // },
    // pr_authors: {
    //   sql: "member_id",
    //   type: `countDistinct`,
    //   filters: [
    //     {
    //       sql: `${CUBE}.type = 'pull_request-openend'`,
    //     },
    //   ],
    // },
    lines_total: {
      sql: `lines_code`,
      type: `sum`,
      description: `Total number of lines of code`,
    },
    hours_total: {
      sql: `${hours}`,
      type: `sum`,
      description: `Total number of hours`,
    },
    hours_avg: {
      sql: `${hours_total} / (case when ${activity_count} <= 0 then 1 else ${activity_count} end)`, //to convert it to hours
      type: `number`,
      description: `Average number of hours`,
    },
  },
  segments: {
  },
  preAggregations: {
    
    main: {
      measures: [CUBE.activity_count],
      dimensions: [Members.displayName, Members.id],
      timeDimension: CUBE.created_at,
      granularity: `day`,
      refreshKey: {
        every: `1 day`
      }
    },
    //   commentersMonthly: {
    //     measures: [PullRequestsOverview.commenters],
    //     timeDimension: PullRequestsOverview.timestamp,
    //     granularity: `month`,
    //   },
    //   mergedMonthly: {
    //     measures: [PullRequestsOverview.merged_count],
    //     dimensions: [PullRequestsOverview.prs_merged],
    //     timeDimension: PullRequestsOverview.timestamp,
    //     granularity: `month`,
    //   },
    //   prCreators: {
    //     measures: [PullRequestsOverview.pr_authors],
    //     dimensions: [PullRequestsOverview.repository_url],
    //     timeDimension: PullRequestsOverview.timestamp,
    //     granularity: `month`,
    //   },
  },
});
