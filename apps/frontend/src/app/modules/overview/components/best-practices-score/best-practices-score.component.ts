// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FilterService, InsightsFilters } from '@app/shared/services/filter.service';
import { OverviewService } from '@app/shared/services/overview.service';
import { faBars, faDownload } from '@fortawesome/pro-regular-svg-icons';
import { faGavel } from '@fortawesome/pro-solid-svg-icons';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BestPracticeScores } from 'lfx-insights';
import { Observable, take, tap } from 'rxjs';
import { DownloadService } from '@app/shared/services/download.service';
import { EmbedReportSummaryComponent } from '../embed-report-summary/embed-report-summary.component';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'lfx-best-practices-score',
  templateUrl: './best-practices-score.component.html',
  styleUrls: ['./best-practices-score.component.scss']
})
export class BestPracticesScoreComponent implements OnInit {
  @ViewChild('popup') private popup: any;
  public markdownUrl = `[![LFXInsights](https://img.shields.io/endpoint?url=https://lfx.dev/api/projects/cncf/kubernetes/)](https://insights.lfx.dev/projects/cncf/kubernetes)`;
  public icons = {
    faDownload,
    faMenu: faBars,
    faGavel
  };
  public bestPracticeDetails: Observable<BestPracticeScores[]>;
  public bestPracticeData: BestPracticeScores[];
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
  public visibleDetailIdx: number = -1;

  public cardName = 'best-practices-score';

  public constructor(
    public matDialog: MatDialog,
    public elementRef: ElementRef,
    private filterService: FilterService,
    private overviewService: OverviewService,
    private downloadService: DownloadService
  ) {}

  public ngOnInit(): void {
    this.filterService.filter$.pipe(untilDestroyed(this)).subscribe(
      (filter: InsightsFilters) =>
        (this.bestPracticeDetails = this.overviewService.getBestPracticeScores(filter).pipe(
          take(1),
          tap((d) => {
            this.bestPracticeData = d;
            this.downloadService.updateReadToDownload(
              this.cardName,
              d.map(({ repositoryId: _, ...rest }) => rest)
            );
          })
        ))
    );
  }

  public openGetBadgeDialog() {
    this.matDialog.open(this.popup, {
      height: '300px',
      width: '750px'
    });
  }

  public openEmbedDialog() {
    this.matDialog.open(EmbedReportSummaryComponent, {
      height: '550px',
      width: '820px',
      data: {
        scores: this.bestPracticeData
      }
    });
  }

  public copyLink(urlBox: any) {
    navigator.clipboard.writeText(urlBox.innerText);
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

  public toggleDetails(idx: number): void {
    if (this.visibleDetailIdx === idx) {
      this.visibleDetailIdx = -1;
    } else {
      this.visibleDetailIdx = idx;
    }
  }
}
