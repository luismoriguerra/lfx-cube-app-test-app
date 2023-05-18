// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

/* eslint-disable @typescript-eslint/naming-convention */
export const cubeActiveDays = {
  dimensions: {
    timestamp: 'activeDays.timestamp',
    days: 'activeDays.days',
    repository_url: 'activeDays.repository_url',
    tenant_id: 'activeDays.tenant_id'
  },
  measures: {
    activeDay: 'activeDays.activeDay',
    totalActiveDays: 'activeDays.totalActiveDays',
    totalContributions: 'activeDays.totalContributions',
    avgContributions: 'activeDays.avgContributions'
  }
};
