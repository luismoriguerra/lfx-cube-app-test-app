// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

/* eslint-disable @typescript-eslint/naming-convention */
import { gql } from '@apollo/client/core';
import { graphqlClient } from '@app/shared/services/cube-graphql';
import { calculatePercentageChange, getPercentageOfRounded } from '@app/shared/utils/cubejs-helpers';
import { Observable, Observer, from, retry } from 'rxjs';

export async function getGeographicalDistribution({
  tenantId = 'ccff5355-cf54-40a1-9a2e-8e4a447ae73a',
  dateRange = ['2023-01-01', '2023-05-30'],
  previousDateRange = ['2022-01-01', '2022-12-28']
} = {}): Promise<any> {
  const contributorsQuery = gql`
    query CubeQuery($tenantIds: [String]!, $dateRange: [String!]!, $previousDateRange: [String!]!) {
      no_usa_total: cube(
        where: {
          summaryContributors: {
            tenantId: { in: $tenantIds }
            lastActivity: { inDateRange: $dateRange }
            AND: [{ contributor_country: { set: true } }, { contributor_country: { notIn: "United States" } }]
          }
        }
      ) {
        summaryContributors {
          count
        }
      }
      no_usa_total_previous: cube(
        where: {
          summaryContributors: {
            tenantId: { in: $tenantIds }
            lastActivity: { inDateRange: $previousDateRange }
            AND: [{ contributor_country: { set: true } }, { contributor_country: { notIn: "United States" } }]
          }
        }
      ) {
        summaryContributors {
          count
        }
      }
      total: cube(
        where: { summaryContributors: { contributor_country: { set: true }, tenantId: { in: $tenantIds }, lastActivity: { inDateRange: $dateRange } } }
      ) {
        summaryContributors {
          count
        }
      }
      total_previous: cube(
        where: { summaryContributors: { contributor_country: { set: true }, tenantId: { in: $tenantIds }, lastActivity: { inDateRange: $previousDateRange } } }
      ) {
        summaryContributors {
          count
        }
      }
      countries: cube(
        where: { summaryContributors: { contributor_country: { set: true }, tenantId: { in: $tenantIds }, lastActivity: { inDateRange: $dateRange } } }
      ) {
        summaryContributors(orderBy: { count: desc }) {
          count
          contributor_country
        }
      }
    }
  `;

  const grahqlResponse = await graphqlClient.query({
    query: contributorsQuery,
    variables: {
      tenantIds: [tenantId],
      dateRange,
      previousDateRange
    }
  });
  if (grahqlResponse.errors || grahqlResponse.error) {
    throw new Error('error querying cube');
  }

  const graphqlData = grahqlResponse.data;

  const geographicalDistribution = convertToGeographicalDistribution(graphqlData);

  return geographicalDistribution;
}

function convertToGeographicalDistribution(data: any) {
  const total = data.total[0].summaryContributors.count;
  const totalPrevious = data.total_previous[0].summaryContributors.count;
  const deltaPercentage = calculatePercentageChange(totalPrevious || 0, total || 0);

  const noUsaTotal = data.no_usa_total[0].summaryContributors.count;
  const noUsaTotalPrevious = data.no_usa_total_previous[0].summaryContributors.count;
  const noUsaDeltaPercentage = calculatePercentageChange(noUsaTotalPrevious || 0, noUsaTotal || 0);

  const countryListWithShare = data.countries.map((country: any) => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    id: 'US',
    country_code: 'US',
    country: country.summaryContributors.contributor_country,
    count: country.summaryContributors.count,
    share: getPercentageOfRounded(country.summaryContributors.count, total),
    // currently we only have 1 repo onboarded
    recentActivityRepository: 'communitybridge/easycla'
  }));

  return {
    total,
    totalPrevious,
    noUsaTotal,
    noUsaTotalPrevious,
    deltaPercentage,
    noUsaDeltaPercentage,
    countryListWithShare
  };
}

export interface GeographicalDistribution {
  total: number;
  totalPrevious: number;
  noUsaTotal: number;
  noUsaTotalPrevious: number;
  deltaPercentage: number;
  noUsaDeltaPercentage: number;
  countryListWithShare: CountryWithShare[];
}

export interface CountryWithShare {
  country: string;
  count: number;
  share: number;
  recentActivityRepository: string;
  country_code?: string;
}

export function getGeographicalDistribution$({
  projectId,
  dateRange,
  previousDateRange
}: {
  projectId: string;
  dateRange: [string, string];
  previousDateRange: [string, string];
}): Observable<GeographicalDistribution> {
  return from(
    getGeographicalDistribution({
      tenantId: projectId,
      dateRange,
      previousDateRange
    })
  ).pipe(retry(2));
}
