// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Project } from 'lfx-insights';

export const defaultProject: Project = {
  id: 'k8s',
  name: '',
  slug: '',
  description: '',
  projectType: '',
  type: '',
  enabledServices: [],
  parent: '',
  projectLogo: '',
  isOnBoarded: false,
  foundation: {
    id: '',
    logoUrl: '',
    name: '',
    slug: ''
  },
  favorite: false,
  repositories: 2,
  commits: ''
};

export const averageWaitTimeBarData = {
  observations: {
    value: `9h 4m`,
    changes: '+14%',
    changeDirection: 'negative',
    text: 'Average Wait Time for 1st Review'
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
    // oct 25
    {
      date: new Date(2022, 9, 25).getTime(),
      value: 3
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
