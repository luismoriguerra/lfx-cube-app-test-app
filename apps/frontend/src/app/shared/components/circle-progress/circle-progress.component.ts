// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'lfx-circle-progress',
  templateUrl: './circle-progress.component.html',
  styleUrls: ['./circle-progress.component.scss']
})
export class CircleProgressComponent {
  @Input() public value: number = 0;
  @Input() public color: string = '';
  @Input() public size: string = '';
  @Input() public flip: boolean = false;
  @Input() public innerTemplate: TemplateRef<any> | null = null;

  public get maskDeg(): number {
    return ((this.value / 100) * 360) / 2;
  }

  public get progressColor(): string {
    return this.color !== '' ? `background-color: ${this.color};` : '';
  }

  public get maskRect(): string {
    return this.size === '' ? '' : `clip: rect(0px, ${this.size}, ${this.size}, calc(${this.size} / 2));`;
  }

  public get fillRect(): string {
    return this.size === '' ? '' : `clip: rect(0px, calc(${this.size} / 2), ${this.size}, 0px);`;
  }

  public get maskFullRotation(): string {
    return this.flip ? '180' : this.maskDeg.toString();
  }

  public get maskHalfRotation(): string {
    return this.flip ? (180 - this.maskDeg).toString() : '0';
  }
}
