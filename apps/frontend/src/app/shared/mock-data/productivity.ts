// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

export const workTimeDistributionBarData = {
  observations: {
    value: 58,
    changes: '+11%',
    changeDirection: 'negative',
    text: 'Average Weekly Hours'
  },
  buckets: [
    {
      date: new Date(2022, 9, 7).getTime(),
      businessHours: 7,
      evenings: 3,
      weekends: 4
    },
    {
      date: new Date(2022, 9, 14).getTime(),
      businessHours: 8,
      evenings: 3,
      weekends: 4
    },
    // oct 21
    {
      date: new Date(2022, 9, 21).getTime(),
      businessHours: 9,
      evenings: 3,
      weekends: 4
    },
    // oct 25
    {
      date: new Date(2022, 9, 25).getTime(),
      businessHours: 9,
      evenings: 3,
      weekends: 4
    },
    // nov 4
    {
      date: new Date(2022, 10, 4).getTime(),
      businessHours: 8,
      evenings: 3,
      weekends: 4
    },
    // nov 11
    {
      date: new Date(2022, 10, 11).getTime(),
      businessHours: 7,
      evenings: 3,
      weekends: 4
    },
    // nov 18
    {
      date: new Date(2022, 10, 18).getTime(),
      businessHours: 7,
      evenings: 3,
      weekends: 4
    },
    // nov 25
    {
      date: new Date(2022, 10, 25).getTime(),
      businessHours: 5,
      evenings: 2,
      weekends: 1
    },
    // dec 2
    {
      date: new Date(2022, 11, 2).getTime(),
      businessHours: 4,
      evenings: 3,
      weekends: 2
    },
    // dec 9
    {
      date: new Date(2022, 11, 9).getTime(),
      businessHours: 3,
      evenings: 1,
      weekends: 2
    },
    // dec 16
    {
      date: new Date(2022, 11, 16).getTime(),
      businessHours: 5,
      evenings: 2,
      weekends: 1
    },
    // dec 23
    {
      date: new Date(2022, 11, 23).getTime(),
      businessHours: 3,
      evenings: 3,
      weekends: 2
    }
  ]
};
