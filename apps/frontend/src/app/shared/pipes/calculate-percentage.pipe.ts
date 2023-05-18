// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calculatePercentage'
})
export class CalculatePercentagePipe implements PipeTransform {
  public transform(value: number, total: number): string {
    if (total === 0) {
      return '0%';
    }

    const percentage = (value / total) * 100;
    return `${percentage.toFixed(2)}%`;
  }
}
