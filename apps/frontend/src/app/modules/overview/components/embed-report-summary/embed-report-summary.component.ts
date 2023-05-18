// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faTimes } from '@fortawesome/pro-light-svg-icons';
import { BestPracticeScores } from 'lfx-insights';

@Component({
  selector: 'lfx-embed-report-summary',
  templateUrl: './embed-report-summary.component.html',
  styleUrls: ['./embed-report-summary.component.scss']
})
export class EmbedReportSummaryComponent {
  public icons = {
    faTimes
  };

  public blocks: any = {
    markdown:
      '[![LFXInsights Report Summary](https://img.shields.io/endpoint?url=https://lfx.dev/api/projects/cncf kubernetes/report-summary)](https://insights.lfx.dev/projects/cncf/kubernetes)',
    asciDoc:
      'https://insights.lfx.dev/projects/cncf/kubernetes[image:https://img.shields.io/endpoint?url=https://insights.lfx.dev/api/projects/cncf/kubernetes/report-summary[LFX Insights]]',
    html: '<a href="https://insights.lfx.dev/projects/cncf/kubernetes" rel="noopener noreferrer" target="_blank"><img src="https://insights.lfx.dev/api/projects/cncf/kubernetes/report-summary?theme=light" alt="LFX Insights Report Summary" /></a>'
  };

  public bestPracticesScores = [
    {
      icon: 'assets/icons/documentation-icon.svg',
      scoreField: 'documentationScore',
      label: 'Documentation',
      key: 'documentation'
    },
    {
      icon: 'assets/icons/license-icon.svg',
      scoreField: 'licenseScore',
      label: 'License',
      key: 'license'
    },
    {
      icon: 'assets/icons/best-practices-icon.svg',
      scoreField: 'bestPracticesScore',
      label: 'Best Practices',
      key: 'best-practices'
    },
    {
      icon: 'assets/icons/security-icon.svg',
      scoreField: 'securityScore',
      label: 'Security',
      key: 'security'
    },
    {
      icon: 'assets/icons/legal-icon.svg',
      scoreField: 'legalScore',
      label: 'Legal',
      key: 'legal'
    }
  ];

  public constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      scores: BestPracticeScores[];
    }
  ) {}

  public get bestPracticeData(): BestPracticeScores[] {
    return this.data.scores;
  }

  public getScoreValue(key: string): number {
    return this.bestPracticeData && this.bestPracticeData.length > 0 ? (this.bestPracticeData[0][key as keyof BestPracticeScores] as number) : 0;
  }

  public getColor(value: number) {
    if (value >= 75) {
      return '#008002';
    } else if (value < 75 && value >= 50) {
      return '#ff7a00';
    } else if (value < 50 && value >= 25) {
      return '#ffba00';
    } else if (value < 25 && value > 0) {
      return '#c40000';
    }

    return '#e6e6e6';
  }
}
