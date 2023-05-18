// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

export interface ServiceHealth {
  DateTime: string;
  [key: string]: string;
}

export interface PaginatedResponse {
  Data: [any];
  Metadata: {
    Offset: number;
    PageSize: number;
    TotalSize: number;
  };
}

export interface Permission {
  [key: string]: boolean;
}
