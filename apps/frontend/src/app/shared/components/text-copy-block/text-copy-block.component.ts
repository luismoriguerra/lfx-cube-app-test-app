// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component, Input } from '@angular/core';
import { faCopy, IconDefinition } from '@fortawesome/pro-light-svg-icons';

@Component({
  selector: 'lfx-text-copy-block',
  templateUrl: './text-copy-block.component.html',
  styleUrls: ['./text-copy-block.component.scss']
})
export class TextCopyBlockComponent {
  @Input() public text: string = '';

  public faCopy: IconDefinition = faCopy;
  public showMsg: boolean = false;

  public copyLink(copyBox: any) {
    this.showMsg = true;
    // TODO: Add UI feedback that this action happened. Need to consult with designers
    navigator.clipboard.writeText(copyBox.innerText);
    setTimeout(() => {
      this.showMsg = false;
    }, 1000);
  }
}
