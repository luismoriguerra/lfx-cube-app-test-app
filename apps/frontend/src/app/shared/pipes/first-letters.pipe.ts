// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstLetters'
})
export class FirstLettersPipe implements PipeTransform {
  public transform(name: string): string {
    const firstLetters = name
      .split(' ')
      .map((x) => x[0].toUpperCase())
      .slice(0, 2);

    return firstLetters.join('');
  }
}
