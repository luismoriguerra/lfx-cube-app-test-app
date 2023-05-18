// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'lfx-performance-metrics',
  templateUrl: './performance-metrics.component.html',
  styleUrls: ['./performance-metrics.component.scss']
})
export class PerformanceMetricsComponent implements OnInit {
  public activeCardId: any;
  public cards = [
    {
      id: 0,
      title: 'Time To Merge (TTM)',
      value: '1d 3hrs',
      changeFromPrevious: 7,
      totalText: '247 Total PRs'
    },
    {
      id: 1,
      title: 'Build Frequency',
      value: '2d 4hrs',
      changeFromPrevious: -22,
      totalText: '285 Total PRs'
    },
    {
      id: 2,
      title: 'Build Failure Rate',
      value: '17%',
      changeFromPrevious: 21,
      totalText: '56 Total Failures'
    }
  ];
  public constructor(public elementRef: ElementRef) {}
  public ngOnInit(): void {
    this.activeCardId = this.cards[0].id;
  }

  public updateActiveCard(cardId: any) {
    this.activeCardId = cardId;
  }
}
