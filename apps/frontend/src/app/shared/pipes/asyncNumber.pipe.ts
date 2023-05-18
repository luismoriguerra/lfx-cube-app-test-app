// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'asyncNumberPipe'
})
export class AsyncNumberPipe implements PipeTransform {
  public async transform(asyncFn: () => Promise<number>): Promise<number> {
    return await asyncFn();
  }
}
