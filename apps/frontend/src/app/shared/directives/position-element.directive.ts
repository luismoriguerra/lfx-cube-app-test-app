// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appLfxPositionElement]'
})
export class PositionElementDirective implements OnInit {
  public constructor(private el: ElementRef, private renderer: Renderer2) {}

  public ngOnInit() {
    this.setPosition();
  }

  public setPosition() {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const availableSpace = rect.left;
    const threshold = 500;

    if (availableSpace < threshold) {
      this.renderer.setStyle(this.el.nativeElement, 'left', '0');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'right', '0');
    }
  }
}
