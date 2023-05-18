// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

export const contributionsEngagementDataExample = {
  observations: {
    value: 9,
    changes: '+14%',
    changeDirection: 'negative',
    text: 'Average Gap'
  },
  buckets: [
    {
      date: new Date(2022, 9, 7).getTime(),
      value: 5
    },
    {
      date: new Date(2022, 9, 14).getTime(),
      value: 6
    },
    // oct 21
    {
      date: new Date(2022, 9, 21).getTime(),
      value: 7
    },
    // nov 4
    {
      date: new Date(2022, 10, 4).getTime(),
      value: 7
    },
    // nov 11
    {
      date: new Date(2022, 10, 11).getTime(),
      value: 5
    },
    // nov 18
    {
      date: new Date(2022, 10, 18).getTime(),
      value: 6
    },
    // nov 25
    {
      date: new Date(2022, 10, 25).getTime(),
      value: 9
    },
    // dec 2
    {
      date: new Date(2022, 11, 2).getTime(),
      value: 12
    },
    // dec 9
    {
      date: new Date(2022, 11, 9).getTime(),
      value: 13
    },
    // dec 16
    {
      date: new Date(2022, 11, 16).getTime(),
      value: 11
    },
    // dec 23
    {
      date: new Date(2022, 11, 23).getTime(),
      value: 11
    }
  ]
};
