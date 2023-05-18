// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boldPhrase'
})
export class BoldPhrasePipe implements PipeTransform {
  public transform(value: string): string {
    const regex = /b\{(.*?)\}/g;

    return value.replace(regex, (match, text) => `<b>${text}</b>`);
  }
}
