// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lfxShortNumber'
})
export class ShortNumberPipe implements PipeTransform {
  public transform(value: number | undefined | null): any {
    if (value === undefined || value === null) {
      return value;
    }

    if (isNaN(value)) {
      return value;
    } // will only work value is a value

    if (value === null) {
      return 0;
    }

    if (value === 0) {
      return value;
    }
    let abs = Math.abs(value);
    const rounder = Math.pow(10, 1);
    const isNegative = value < 0; // will also work for Negative numbers
    let key = '';

    const powers = [
      { key: 'Q', value: Math.pow(10, 15) },
      { key: 'T', value: Math.pow(10, 12) },
      { key: 'B', value: Math.pow(10, 9) },
      { key: 'M', value: Math.pow(10, 6) },
      { key: 'K', value: 1000 }
    ];
    let i = 0;
    while (i < powers.length) {
      let reduced = abs / powers[i].value;

      reduced = (reduced * rounder) / rounder;

      if (reduced >= 1) {
        abs = reduced;
        key = powers[i].key;
        break;
      }
      i++;
    }

    return (isNegative ? '-' : '') + (this.isFloat(+abs.toFixed(4)) ? (key.length ? abs.toFixed(4).slice(0, -2) : abs.toFixed(2)) : abs) + key;
  }

  private isFloat(n: number) {
    return Number(n) === n && n % 1 !== 0;
  }
}
