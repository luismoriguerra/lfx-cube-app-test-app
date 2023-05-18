// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Pipe, PipeTransform } from '@angular/core';
import { ShortNumberPipe } from './short-number.pipe';

@Pipe({
  name: 'numberColor'
})
export class NumberColorPipe implements PipeTransform {
  public constructor(private lfxShortNumberPipe: ShortNumberPipe) {}

  public transform(contributorCommitsDelta: number | null): string {
    if (contributorCommitsDelta === null) {
      return '';
    }
    const isPositive = contributorCommitsDelta > 0;
    const textColorClass = isPositive ? 'text-green-light' : 'text-red-dark';
    let formattedValue = this.lfxShortNumberPipe.transform(contributorCommitsDelta);
    if (isPositive) {
      formattedValue = `+${formattedValue}`;
    }
    return `<span class="${textColorClass}">(${formattedValue})</span>`;
  }
}
