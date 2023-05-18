// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

export interface PropertyCheck {
  propertyName: string;
  value: string | string[];
}

export interface ApiIdentity {
  name: string; // this will be used as the wait alias
  properties: PropertyCheck[];
  selector?: string;
  isIntercepted: boolean;
}
