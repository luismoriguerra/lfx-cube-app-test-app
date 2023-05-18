// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { TableConfig } from '@app/core/models/table.model';
import { tableRecords } from './code-review-participants.features';

@Component({
  selector: 'lfx-code-review-participants',
  templateUrl: './code-review-participants.component.html',
  styleUrls: ['./code-review-participants.component.scss']
})
export class CodeReviewParticipantsComponent implements AfterViewInit {
  @ViewChild('numberTemplate') private numberTemplate!: TemplateRef<any>;
  @ViewChild('nameTemplate') private nameTemplate!: TemplateRef<any>;
  @ViewChild('githubNameTemplate') private githubNameTemplate!: TemplateRef<any>;
  @ViewChild('commitsTemplate') private commitsTemplate!: TemplateRef<any>;
  @ViewChild('totalTemplate') private totalTemplate!: TemplateRef<any>;

  public tableRecords = tableRecords;
  public tableConfiguration: TableConfig;
  public ngAfterViewInit(): void {
    this.tableConfiguration = {
      sortedBy: 'Rank',
      columns: [
        {
          title: 'Rank',
          key: 'rank',
          columnCssClass: 'justify-center text-center',
          headerCssClass: 'justify-center text-center !font-arial',
          width: '10%',
          template: this.numberTemplate,
          sortable: true
        },
        {
          title: 'Contributor',
          key: 'name',
          columnCssClass: '',
          headerCssClass: '',
          width: '59%',
          template: this.githubNameTemplate
        },
        {
          title: 'Pull Requests',
          key: 'prs',
          columnCssClass: 'justify-center text-center',
          headerCssClass: 'justify-center text-center',
          width: '15%',
          template: this.commitsTemplate
        },
        {
          title: 'Total',
          key: 'total',
          columnCssClass: 'justify-center text-center',
          headerCssClass: 'justify-center text-center',
          width: '15%',
          template: this.totalTemplate
        }
      ]
    };
  }
}
