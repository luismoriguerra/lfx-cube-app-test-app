// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { DropdownOptions } from '../interface/common';

export const metrics: DropdownOptions[] = [
  { label: 'Comments', value: 'comment' },
  // { label: 'Commits', value: 'commits' },
  { label: 'Contributions', value: 'contributions' },
  { label: 'Issues', value: 'issues' },
  { label: 'PR Requests', value: 'pull_request' }
];

export const timezones: DropdownOptions[] = [
  { label: 'UTC-12 (U.S. Outlying Islands)', value: 'UTC-12' },
  { label: 'UTC-11 (American Samoa)', value: 'UTC-11' },
  { label: 'UTC-10 (Hawaii)', value: 'UTC-10' },
  { label: 'UTC-9 (Alaska)', value: 'UTC-9' },
  { label: 'UTC-8 (San Francisco)', value: 'UTC-8' },
  { label: 'UTC-7 (Denver)', value: 'UTC-7' },
  { label: 'UTC-6 (Chicago)', value: 'UTC-6' },
  { label: 'UTC-5 (New York)', value: 'UTC-5' },
  { label: 'UTC-4 (Halifax)', value: 'UTC-4' },
  { label: 'UTC-3 (Buenos Aires)', value: 'UTC-3' },
  { label: 'UTC-2 (Noronha)', value: 'UTC-2' },
  { label: 'UTC-1 (Azores)', value: 'UTC-1' },
  { label: 'UTC (Greenwich Mean Time)', value: 'UTC' },
  { label: 'UTC+1 (Amsterdam)', value: 'UTC+1' },
  { label: 'UTC+2 (Helsinki)', value: 'UTC+2' },
  { label: 'UTC+3 (Minsk)', value: 'UTC+3' },
  { label: 'UTC+4 (Samara)', value: 'UTC+4' },
  { label: 'UTC+5 (Karachi)', value: 'UTC+5' },
  { label: 'UTC+6 (Bangladesh)', value: 'UTC+6' },
  { label: 'UTC+7 (Bangkok)', value: 'UTC+7' },
  { label: 'UTC+8 (Hong Kong)', value: 'UTC+8' },
  { label: 'UTC+9 (Tokyo)', value: 'UTC+9' },
  { label: 'UTC+10 (Brisbane)', value: 'UTC+10' },
  { label: 'UTC+11 (Guadalcanal)', value: 'UTC+11' },
  { label: 'UTC+12 (Aukland)', value: 'UTC+12' }
];
