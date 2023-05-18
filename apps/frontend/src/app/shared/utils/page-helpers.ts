// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { TableNames } from '@app/core/models/table.model';
import { ChartNames } from 'lfx-insights';

const overviewCardNames: { cardName: string; isReady: boolean }[] = [
  {
    cardName: ChartNames.ContributorsMini,
    isReady: false
  },
  {
    cardName: ChartNames.CommitsMini,
    isReady: false
  },
  {
    cardName: ChartNames.IssuesMini,
    isReady: false
  },
  {
    cardName: ChartNames.PullRequestsMini,
    isReady: false
  },
  {
    cardName: ChartNames.ForksMini,
    isReady: false
  },
  {
    cardName: ChartNames.StarsMini,
    isReady: false
  },
  {
    cardName: TableNames.organizationLeaderboard,
    isReady: false
  },
  {
    cardName: TableNames.contributorLeaderboard,
    isReady: false
  },
  {
    cardName: 'best-practices-score',
    isReady: false
  },
  {
    cardName: ChartNames.ActiveDaysChart,
    isReady: false
  },
  {
    cardName: ChartNames.ContributorsByCountry,
    isReady: false
  },
  {
    cardName: ChartNames.WorkTimeDistribution,
    isReady: false
  }
];
const productivityCardNames: { cardName: string; isReady: boolean }[] = [];
const velocityCardNames: { cardName: string; isReady: boolean }[] = [];

export function getPageCardsName(pageTitle: string): { cardName: string; isReady: boolean }[] {
  switch (pageTitle.toLowerCase()) {
    case 'overview':
      return overviewCardNames;

    case 'productivity':
      return productivityCardNames;

    case 'velocity':
      return velocityCardNames;

    default:
      return overviewCardNames;
  }
}
