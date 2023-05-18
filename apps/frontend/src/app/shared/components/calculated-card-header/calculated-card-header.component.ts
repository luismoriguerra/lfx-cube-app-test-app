// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'lfx-calculated-card-header',
  templateUrl: './calculated-card-header.component.html',
  styleUrls: ['./calculated-card-header.component.scss']
})
export class CalculatedCardHeaderComponent implements OnInit {
  @Input() public tooltipTemplate: TemplateRef<any>;
  @Input() public title: string;
  public showTooltip = false;

  public constructor() {}

  public ngOnInit() {}

  public toggleTooltip() {
    this.showTooltip = !this.showTooltip;
  }
}
