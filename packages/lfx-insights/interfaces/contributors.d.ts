// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

export interface ContributorDependency {
  name: string;
  logoUrl: string;
  userId: string;
  date: string;
  contributions: {
    value: number;
    percent: number;
    changeFromPrevious: number;
  };
}
