// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { createChart, createChartRoot, createColumnSeries, createLegend, createXAxis, createYAxis } from '@utils/chart-helpers';
import { GranularityEnum } from 'lfx-insights';

export const contributionsDataExample = [
  {
    date: new Date(2022, 9, 7).getTime(),
    value: 7
  },
  {
    date: new Date(2022, 9, 14).getTime(),
    value: 14
  },
  // oct 21
  {
    date: new Date(2022, 9, 21).getTime(),
    value: 21
  },
  // nov 4
  {
    date: new Date(2022, 10, 4).getTime(),
    value: 28
  },
  // nov 11
  {
    date: new Date(2022, 10, 11).getTime(),
    value: 11
  },
  // nov 18
  {
    date: new Date(2022, 10, 18).getTime(),
    value: 7
  },
  // nov 25
  {
    date: new Date(2022, 10, 25).getTime(),
    value: 14
  },
  // dec 2
  {
    date: new Date(2022, 11, 2).getTime(),
    value: 21
  },
  // dec 9
  {
    date: new Date(2022, 11, 9).getTime(),
    value: 28
  },
  // dec 16
  {
    date: new Date(2022, 11, 16).getTime(),
    value: 11
  },
  // dec 23
  {
    date: new Date(2022, 11, 23).getTime(),
    value: 7
  }
];

export const getChartCommitsBars =
  (parentDiv = 'chartdiv', isMicro = false) =>
  (data: any[] = contributionsDataExample) =>
  () => {
    const root = createChartRoot(parentDiv, isMicro);
    const chart = createChart(root);
    const yAxis = createYAxis(root, chart);
    const xAxis = createXAxis(root, chart, GranularityEnum.week);

    createColumnSeries(root, chart, xAxis, yAxis, data, 'Forks', 'value', '#0068fa');

    if (!isMicro) {
      createLegend(root, chart, { iconSize: 12 });
    }
    chart.appear(1000, 100);
    return root;
  };

export const commitsPerDayMock: any = {
  observations: {
    value: 8.29,
    changes: '-3%',
    changeDirection: 'positive',
    text: 'Commits Per Active Day'
  },
  buckets: [
    {
      date: new Date(2022, 9, 7).getTime(),
      value: 7
    },
    {
      date: new Date(2022, 9, 14).getTime(),
      value: 8
    },
    // oct 21
    {
      date: new Date(2022, 9, 21).getTime(),
      value: 9
    },
    // nov 4
    {
      date: new Date(2022, 10, 4).getTime(),
      value: 8
    },
    // nov 11
    {
      date: new Date(2022, 10, 11).getTime(),
      value: 7
    },
    // nov 18
    {
      date: new Date(2022, 10, 18).getTime(),
      value: 7
    },
    // nov 25
    {
      date: new Date(2022, 10, 25).getTime(),
      value: 8
    },
    // dec 2
    {
      date: new Date(2022, 11, 2).getTime(),
      value: 9
    },
    // dec 9
    {
      date: new Date(2022, 11, 9).getTime(),
      value: 10
    },
    // dec 16
    {
      date: new Date(2022, 11, 16).getTime(),
      value: 11
    },
    // dec 23
    {
      date: new Date(2022, 11, 23).getTime(),
      value: 10
    }
  ]
};
