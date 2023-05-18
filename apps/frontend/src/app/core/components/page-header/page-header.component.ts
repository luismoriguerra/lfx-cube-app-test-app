// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';

@Component({
  selector: 'lfx-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {
  public form: FormGroup;

  public constructor(private fb: UntypedFormBuilder) {
    this.form = this.fb.group({
      search: ['']
    });
  }
}
