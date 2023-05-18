// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProgressBarConfig } from '@app/shared/interface/common';
import { faCaretDown, faCaretUp } from '@fortawesome/pro-solid-svg-icons';

@Component({
  selector: 'lfx-best-practices-details',
  templateUrl: './best-practices-details.component.html',
  styleUrls: ['./best-practices-details.component.scss']
})
export class BestPracticesDetailsComponent implements OnInit {
  @Input() public value: number = 0;
  @Input() public label: string = '';
  @Input() public icon: string = '';
  @Input() public progressBarStyle: string = 'thin';
  @Input() public embedMode: boolean = false;
  @Input() public showDetails: boolean = false;
  @Output() public readonly toggleMetricEmitter = new EventEmitter();
  public icons = {
    faCaretDownSolid: faCaretDown,
    faCaretUpSolid: faCaretUp
  };
  public constructor() {}

  public ngOnInit(): void {}

  public toggleMetric() {
    this.toggleMetricEmitter.emit();
  }

  public getColor() {
    const value = this.value;

    if (value >= 75) {
      return '#008002';
    } else if (value < 75 && value >= 50) {
      return '#ff7a00';
    } else if (value < 50 && value >= 25) {
      return '#ffba00';
    } else if (value < 25 && value > 0) {
      return '#c40000';
    }

    return '#e6e6e6';
  }

  public getConfig(): ProgressBarConfig {
    return {
      color: this.getColor(),
      rounded: true,
      background: 'gray',
      class: 'progress-bar-col'
    };
  }

  public displayedValue() {
    if (this.value > 100) {
      return 100;
    } else if (this.value < 0) {
      return 0;
    }

    return this.value;
  }
}
