// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'absValue' })
export class AbsoluteValuePipe implements PipeTransform {
  public transform(value: number): number {
    return Math.abs(value);
  }
}
