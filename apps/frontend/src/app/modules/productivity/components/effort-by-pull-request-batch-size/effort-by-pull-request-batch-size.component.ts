// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'lfx-effort-by-pull-request-batch-size',
  templateUrl: './effort-by-pull-request-batch-size.component.html',
  styleUrls: ['./effort-by-pull-request-batch-size.component.scss']
})
export class EffortByPullRequestBatchSizeComponent implements OnInit {
  public efforts = [
    {
      title: 'Very Small (1 - 9)',
      participants: 2,
      reviews: 2,
      reviewTime: '1 Hour',
      comments: 1,
      mergeTime: '2 Hours',
      prs: 215
    },
    {
      title: 'Small (10 - 49)',
      participants: 3,
      reviews: 5,
      reviewTime: '2 Hours',
      comments: 8,
      mergeTime: '4 Hours',
      prs: 197
    },
    {
      title: 'Medium (50 - 99)',
      participants: 7,
      reviews: 7,
      reviewTime: '6 Hours',
      comments: 1,
      mergeTime: '11 Hours',
      prs: 124
    },
    {
      title: 'Large (100-499)',
      participants: 7,
      reviews: 14,
      reviewTime: '47 Hours',
      comments: 23,
      mergeTime: '107 Hours',
      prs: 110
    },
    {
      title: 'Gigantic (500+)',
      participants: 14,
      reviews: 27,
      reviewTime: '96 Hours',
      comments: 49,
      mergeTime: '240 Hours',
      prs: 64
    }
  ];
  public constructor(public elementRef: ElementRef) {}

  public ngOnInit() {}
}
