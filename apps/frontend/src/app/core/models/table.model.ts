// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { TemplateRef } from '@angular/core';

export const enum TableNames {
  organizationLeaderboard = 'Organization-leaderboard',
  contributorLeaderboard = 'Contributor-leaderboard'
}

export interface AdditionalValues {
  selectedMetric: string;
  isDesc?: boolean;
  limit: number | undefined;
  [key: string]: any;
}

export class TableColumnConfig {
  public title!: string;
  public key!: string;
  public headerCssClass!: string;
  public columnCssClass!: string;
  public template?: TemplateRef<any>;
  public width?: string;
  public sortable?: boolean;
  public constructor() {}
}

export class TableConfig {
  public columns: TableColumnConfig[] = new Array<TableColumnConfig>();
  public isLoading?: boolean;
  public error?: boolean;
  public sortedBy?: string;
  public isDesc?: boolean = true;

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  constructor(columns?: TableColumnConfig[]) {
    this.isLoading = true;
    if (columns) {
      this.columns = columns;
    }
  }
}
