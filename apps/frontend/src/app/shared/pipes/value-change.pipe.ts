// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'valueChange'
})
export class ValueChangePipe implements PipeTransform {
  public transform(value: number, isPast: boolean, validateZero = true): string {
    if (value > 0) {
      return isPast ? 'increased' : 'increase';
    } else if (value < 0) {
      return isPast ? 'decreased' : 'decrease';
    }
    if (validateZero) {
      return 'remained the same';
    }
    return isPast ? 'increased' : 'increase';
  }
}
