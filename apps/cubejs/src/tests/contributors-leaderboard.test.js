// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

const { cubejsApi } = require("../services/cubejs-api");
const { graphqlClient } = require("../services/cubejs-graphql");
const { gql } = require("@apollo/client/core");
const {
  getPercentageOfRounded,
  calculatePercentageChange,
  getPreviousPeriod,
} = require("../utils");

async function getResults(query) {
  return await cubejsApi.load(query);
}

async function dryRun(query) {
  return await cubejsApi.dryRun(query);
}

test("Expect query Contributors List", async () => {
  const resultSet = await getResults({
    measures: ["Activities.count"],
    timeDimensions: [
      {
        dimension: "Activities.timestamp",
        dateRange: ["2023-05-04", "2023-05-11"],
      },
    ],
    order: {
      "Activities.count": "desc",
    },
    dimensions: ["Members.logo_url", "Activities.username"],
    segments: ["Activities.contributions_only"],
    filters: [
      {
        member: "Activities.activity_tenant_id",
        operator: "equals",
        values: ["ccff5355-cf54-40a1-9a2e-8e4a447ae73a"],
      },
    ],
  });
  const expected = resultSet.loadResponses[0].data;
  expect(expected.length).toBeGreaterThan(0);

  const expectedItem = expected[0];
  expect(expectedItem["Members.logo_url"]).not.toBeNull();
  expect(expectedItem["Activities.username"]).not.toBeNull();
  expect(expectedItem["Activities.count"]).not.toBeNull();
});

test("Expect query Contributors Total", async () => {
  const resultSet = await getResults({
    measures: ["Activities.count"],
    timeDimensions: [
      {
        dimension: "Activities.timestamp",
        dateRange: ["2023-05-04", "2023-05-11"],
      },
    ],
    order: {},
    segments: ["Activities.contributions_only"],
    filters: [
      {
        member: "Activities.activity_tenant_id",
        operator: "equals",
        values: ["ccff5355-cf54-40a1-9a2e-8e4a447ae73a"],
      },
    ],
  });
  const expected = Number(
    resultSet.loadResponses[0].data[0]["Activities.count"]
  );

  expect(expected).toBeGreaterThan(0);
});

const METRICS_CONTRIBUTORS = {
  metric_contributor_contributions:
    "Activities.metric_contributor_contributions",
  metric_contributor_contributors: "Activities.metric_contributor_contributors",
  metric_org_issue_commenters: "Activities.metric_org_issue_commenters",
  metric_org_issue_opened: "Activities.metric_org_issue_opened",
  metric_contributor_issues_closed:
    "Activities.metric_contributor_issues_closed",
  metric_org_pr_opened: "Activities.metric_org_pr_opened",
  count_metric_pr_comments: "Activities.count_metric_pr_comments",
  count_metric_pr_reviewers: "Activities.count_metric_pr_reviewers",
  count_metric_pr_reviews: "Activities.count_metric_pr_reviews",
  metric_org_pr_closed: "Activities.metric_org_pr_closed",
  metric_org_pr_merged: "Activities.metric_org_pr_merged",
  metric_org_pr_opened: "Activities.metric_org_pr_opened",
};
test("Expect query Contributors Leaderboard all metrics", async () => {
  const metrics = Object.values(METRICS_CONTRIBUTORS);
  const query = {
    measures: [...metrics],
    timeDimensions: [
      {
        dimension: "Activities.timestamp",
        dateRange: ["2023-05-04", "2023-05-11"],
      },
    ],

    filters: [
      {
        member: "Activities.activity_tenant_id",
        operator: "equals",
        values: ["ccff5355-cf54-40a1-9a2e-8e4a447ae73a"],
      },
    ],
    dimensions: ["Members.logo_url", "Activities.username"],
    order: {
      "Activities.metric_contributor_contributions": "desc",
    },
  };

  const resultSet = await getResults(query);
  const expected = resultSet.loadResponses[0].data;
  expect(expected.length).toBeGreaterThan(0);
});

function getContributorLeaderboard({
  metric = "metric_contributor_contributions",
} = {}) {
  return gql`
    query CubeQuery(
      $tenantIds: [String]!
      $dateRange: [String!]!
      $previousDateRange: [String!]!
    ) {
      total_current: cube(
        where: {
          activities: {
            activity_tenant_id: { in: $tenantIds }
            timestamp: { inDateRange: $dateRange }
          }
        }
      ) {
        activities {
          count: ${metric}
        }
      }
      total_previous: cube(
        where: {
          activities: {
            activity_tenant_id: { in: $tenantIds }
            timestamp: { inDateRange: $previousDateRange }
          }
        }
      ) {
        activities {
          count: ${metric}
        }
      }
      contributors_current: cube(
        where: {
          activities: {
            activity_tenant_id: { in: $tenantIds }
            timestamp: { inDateRange: $dateRange }
          }
        }
      ) {
        activities(orderBy: { ${metric}: desc }) {
          count: ${metric}
          username
          memberId
        }
        members {
         logo_url
        }
      }
      contributors_previous: cube(
        where: {
          activities: {
            activity_tenant_id: { in: $tenantIds }
            timestamp: { inDateRange: $previousDateRange }
          }
        }
      ) {
        activities {
          count: ${metric}
          memberId
        }
      }
    }
  `;
}

function convertToContributorLeaderboardTable(data) {
  const totalCurrent = data.total_current[0].activities.count;
  const totalPrevious = data.total_previous[0].activities.count;
  const deltaPercentage = calculatePercentageChange(
    totalPrevious,
    totalCurrent
  );
  const previousList = data.contributors_previous.map((contributor) => ({
    id: contributor.activities.memberId,
    count: contributor.activities.count || 0,
  }));
  const currentList = data.contributors_current
    .filter((contributor) => contributor.activities.count > 0)
    .map((contributor) => {
      const currentCount = contributor.activities.count || 0;
      const previousCount =
        previousList.find(
          (previousListRow) =>
            previousListRow.id === contributor.activities.memberId
        )?.count || 0;

      const diff = currentCount - previousCount;
      return {
        id: contributor.activities.memberId,
        username: contributor.activities.username,
        logo: contributor.members.logo_url,
        count: contributor.activities.count || 0,
        previousCount,
        countDiff: diff,
        share: getPercentageOfRounded(
          contributor.activities.count || 0,
          totalCurrent || 0
        ),
      };
    });

  return {
    totalCurrent,
    totalPrevious,
    deltaPercentage,
    currentList,
  };
}

test("Expect query Contributors Leaderboard all in one call with graphql", async () => {
  // 1. metric total contributions current period
  // 2. metric total contributions previous period
  // 3. List of contributors current period
  // 4. List of contributors previous period
  // 5. Update Current Period contributors and calculate delta between contributions
  // 6. Update Current Period contributors and calculate the percentage of contributions against the total contributions

  const query = getContributorLeaderboard();
  const currentPeriod = ["2023-05-04", "2023-05-11"];
  const variables = {
    tenantIds: ["ccff5355-cf54-40a1-9a2e-8e4a447ae73a"],
    dateRange: currentPeriod,
    previousDateRange: getPreviousPeriod(...currentPeriod),
  };

  let grahqlResponse = await graphqlClient.query({
    query,
    variables,
  });

  const graphqlData = grahqlResponse.data;

  const { totalCurrent, totalPrevious, deltaPercentage, currentList } =
    convertToContributorLeaderboardTable(graphqlData);

  expect(totalCurrent).not.toBeUndefined();
  expect(totalPrevious).not.toBeUndefined();
  expect(deltaPercentage).not.toBeUndefined();

  const contributor = currentList[0];

  if (contributor) {
    expect(contributor.id).not.toBeUndefined();
    expect(contributor.username).not.toBeUndefined();
    expect(contributor.logo).not.toBeUndefined();
    expect(contributor.count).not.toBeUndefined();
    expect(contributor.previousCount).not.toBeUndefined();
    expect(contributor.countDiff).not.toBeUndefined();
    expect(contributor.share).not.toBeUndefined();
  }
});
