// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iconIndicator'
})
export class IconIndicatorPipe implements PipeTransform {
  public transform(value: string): string {
    const regex = /i\{(-?\d)\}/g;

    return value.replace(regex, (match, variable) => {
      let replacement = '';
      const parsedVar = parseInt(variable, 10);

      switch (parsedVar) {
        case 1:
          replacement = '<span class="status-icon"> <i class="fas fa-chart-line bg-green text-white p-1 rounded-md text-base absolute"></i> </span>';
          break;
        case 0:
          replacement = '<span class="status-icon"> <i class="fas fa-chart-line bg-yellow text-white p-1 rounded-md text-base absolute"></i> </span>';
          break;
        case -1:
          replacement = '<span class="status-icon"> <i class="fas fa-chart-line-down bg-red text-white p-1 rounded-md text-base absolute"></i> </span>';
          break;
        default:
          break;
      }

      return replacement;
    });
  }
}
