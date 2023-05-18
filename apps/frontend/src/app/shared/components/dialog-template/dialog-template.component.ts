// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component, Input } from '@angular/core';
import { faTimes, IconDefinition } from '@fortawesome/pro-light-svg-icons';

@Component({
  selector: 'lfx-dialog-template',
  templateUrl: './dialog-template.component.html',
  styleUrls: ['./dialog-template.component.scss']
})
export class DialogTemplateComponent {
  @Input() public title: string = '';

  public faTimes: IconDefinition = faTimes;
}
