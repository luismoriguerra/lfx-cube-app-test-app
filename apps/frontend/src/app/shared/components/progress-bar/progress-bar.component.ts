// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component, Input } from '@angular/core';
import { ProgressBarConfig } from '@app/shared/interface/common';

@Component({
  selector: 'lfx-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {
  @Input() public config: ProgressBarConfig = {
    color: '',
    rounded: true,
    background: 'gray',
    class: ''
  };

  @Input() public value: number = 0;

  public getClass(): any {
    return {
      ['bg-gray-fef']: this.config.background === 'gray',
      ['rounded-sm']: this.config.rounded,
      ['border border-solid border-gray-f83']: this.config.background === 'clear',
      [this.config.class]: true
    };
  }
}
