// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

export interface ProgressBarConfig {
  color: string;
  rounded: boolean;
  background: 'clear' | 'gray';
  class: string;
}

export interface DropdownOptions {
  label: string;
  value: string;
}

export interface HeatMapData {
  hour: string;
  weekday: string;
  hourValue: number;
  value: number;
}
