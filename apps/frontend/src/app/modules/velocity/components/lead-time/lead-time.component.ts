// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'lfx-lead-time',
  templateUrl: './lead-time.component.html',
  styleUrls: ['./lead-time.component.scss']
})
export class LeadTimeComponent {
  public leadTimeGraph: { label: string; value: number; color: string }[] = [
    { label: 'Pickup', value: 72, color: 'bg-red' },
    { label: 'Review', value: 24, color: 'bg-orange' },
    { label: 'Accepted', value: 27, color: 'bg-yellow' },
    { label: 'Merged', value: 22, color: 'bg-green' }
  ];

  public steps: string[] = ['PR Raised', 'Review Started', 'PR Accepted', 'PR Merged'];

  public constructor(public elementRef: ElementRef) {}
}
