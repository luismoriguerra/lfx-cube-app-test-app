// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component, Input, ElementRef } from '@angular/core';
import { ProgressBarConfig } from '@app/shared/interface/common';
import { PRTimeSize } from 'lfx-insights';

@Component({
  selector: 'lfx-lead-time-by-pr',
  templateUrl: './lead-time-by-pr.component.html',
  styleUrls: ['./lead-time-by-pr.component.scss']
})
export class LeadTimeByPrComponent {
  @Input() public data: PRTimeSize[];

  public constructor(public elementRef: ElementRef) {}
  public getConfig(color: string): ProgressBarConfig {
    return {
      color,
      rounded: false,
      background: 'clear',
      class: 'progress-bar-col'
    };
  }
}
