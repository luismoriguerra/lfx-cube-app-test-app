// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iconStatus'
})
export class IconStatusPipe implements PipeTransform {
  public transform(value: number): string {
    if (value < 0) {
      return '<span class="status-icon"> <i class="fas fa-chart-line-down bg-red text-white p-1 rounded-md text-base absolute"></i> </span>';
    } else if (value > 0) {
      return '<span class="status-icon"> <i class="fas fa-chart-line bg-green text-white p-1 rounded-md text-base absolute"></i> </span>';
    }

    return '<span class="status-icon"> <i class="fas fa-chart-line bg-yellow text-white p-1 rounded-md text-base absolute"></i> </span>';
  }
}
