// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableConfig } from '@app/core/models/table.model';
import { FilterService, InsightsFilters } from '@app/shared/services/filter.service';
import { OverviewService } from '@app/shared/services/overview.service';
import { metrics } from '@app/shared/utils/dropdown-helpers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ContributorDependency } from 'lfx-insights';
import { catchError, forkJoin, of, switchMap, take } from 'rxjs';
import _ from 'lodash';
import { DownloadService } from '@app/shared/services/download.service';
import { DropdownOptions } from '@app/shared/interface/common';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'lfx-contributor-dependency',
  templateUrl: './contributor-dependency.component.html',
  styleUrls: ['./contributor-dependency.component.scss']
})
export class ContributorDependencyComponent implements OnInit, AfterViewInit {
  @ViewChild('numberTemplate') private numberTemplate!: TemplateRef<any>;
  @ViewChild('githubNameTemplate') private githubNameTemplate!: TemplateRef<any>;
  @ViewChild('contributionsTemplate') private contributionsTemplate!: TemplateRef<any>;

  public metrics = metrics;
  public selectedMetric = metrics[0].value;
  public cardName = 'Contributor-dependency';

  public codeDependencyData: ContributorDependency[] = [];
  public tableData: any[] = [];
  public tableDataFullList: any[];
  public tableConfiguration: TableConfig;
  public isLoading: boolean = true;
  public isPartialLoading: boolean = false;
  // TODO: verify if 3 is a constant here
  public percentageThreshold: number = 50; // getting all the contributors that make up 50 or more of the contributions

  public constructor(
    public elementRef: ElementRef,
    public overviewService: OverviewService,
    public filterService: FilterService,
    private downloadService: DownloadService
  ) {}

  public ngOnInit() {
    this.filterService.filter$
      .pipe(
        untilDestroyed(this),
        switchMap((filter: InsightsFilters) => {
          this.tableData = [];
          this.codeDependencyData = [];
          this.isLoading = true;
          return forkJoin([
            this.overviewService.getContributorDependency(filter, this.selectedMetric, false).pipe(take(1)),
            this.overviewService.getContributorDependency(filter, this.selectedMetric, true).pipe(take(1))
          ]);
        }),
        switchMap((res: [ContributorDependency[], ContributorDependency[]]) => of(this.mergeResults(res))),
        catchError((err: any) => of(this.handleError(err)))
      )
      .subscribe((data: ContributorDependency[]) => {
        this.codeDependencyData = data;
        this.buildTableData(data);
        this.downloadService.updateReadToDownload(
          this.cardName,
          this.tableData.map(({ name, ...rest }: any) => rest)
        );
        this.isLoading = false;
      });
  }

  public ngAfterViewInit(): void {
    // TODO: Remove this definition here and rework the table component. This is causing an error "Eression has changed after it was checked."
    this.tableConfiguration = {
      sortedBy: 'Rank',
      columns: [
        {
          title: 'Rank',
          key: 'rank',
          columnCssClass: 'justify-center text-center',
          headerCssClass: 'justify-center text-center !font-arial',
          width: '13.5%',
          template: this.numberTemplate,
          sortable: true
        },
        {
          title: 'Contributor',
          key: 'name',
          columnCssClass: '',
          headerCssClass: '',
          width: '46.5%',
          template: this.githubNameTemplate
        },
        {
          title: 'Contributions (%)',
          key: 'contributions',
          columnCssClass: 'justify-center text-center',
          headerCssClass: 'justify-center text-center',
          width: '40%',
          template: this.contributionsTemplate
        }
      ]
    };
  }

  public get topPercentage(): number {
    return _.sumBy(this.tableData, 'contributions.percent') || 0;
  }

  public getPercentageOfTop(): number {
    return this.tableData.length > 0 ? Math.round((this.tableData.length / this.codeDependencyData.length) * 100) : 0;
  }

  public onSelectChange(val: DropdownOptions): void {
    this.isPartialLoading = true;
    this.tableData = [];
    forkJoin([
      this.overviewService.getContributorDependency(this.filterService.currentFilter, val.value, false).pipe(take(1)),
      this.overviewService.getContributorDependency(this.filterService.currentFilter, val.value, true).pipe(take(1))
    ])
      .pipe(
        untilDestroyed(this),
        switchMap((res: [ContributorDependency[], ContributorDependency[]]) => of(this.mergeResults(res))),
        catchError((err: any) => of(this.handleError(err))),
        take(1)
      )
      .subscribe((data: ContributorDependency[]) => {
        this.codeDependencyData = data;
        this.buildTableData(data);
        this.downloadService.updateReadToDownload(
          this.cardName,
          this.tableData.map(({ name, ...rest }: any) => rest)
        );
        this.isPartialLoading = false;
      });
  }

  public getColor(value: number) {
    if (value >= 50) {
      return '#c40000';
    } else if (value < 50 && value >= 25) {
      return '#ffba00';
      // return '#ff7a00';
    }
    //else {
    return '#008002';
    // }

    // return '#e6e6e6';
  }

  private buildTableData(contributors: ContributorDependency[]): void {
    let remain = this.percentageThreshold;
    this.tableData = contributors
      .filter((cd: ContributorDependency) => {
        if (remain > 0) {
          remain -= cd.contributions.percent;
          return true;
        }

        return false;
      })
      .map((c: ContributorDependency, idx: number) => ({
        rank: idx + 1,
        logoUrl: c.logoUrl,
        name: c.name,
        githubUsername: c.name,
        contributions: c.contributions
      }));

    this.tableDataFullList = contributors.map((c: ContributorDependency, idx: number) => ({
      rank: idx + 1,
      logoUrl: c.logoUrl,
      name: c.name,
      githubUsername: c.name,
      contributions: c.contributions
    }));
  }

  private mergeResults(res: [ContributorDependency[], ContributorDependency[]]): ContributorDependency[] {
    const current = res[0];
    const prev = res[1];
    const totals = _.sumBy(current, 'contributions.value');

    current.forEach((c: ContributorDependency, idx: number) => {
      const fromPrev = prev.find((p) => p.userId === c.userId);

      if (fromPrev) {
        current[idx].contributions.changeFromPrevious = current[idx].contributions.value - fromPrev.contributions.value;
      }

      current[idx].contributions.percent = Math.round((current[idx].contributions.value / totals) * 100);
    });

    return current;
  }

  private handleError(error: any): ContributorDependency[] {
    this.isLoading = false;
    this.isPartialLoading = false;
    // TODO: provide a generic way of handling all errors. Need designers input on this.
    console.error(error);
    return [];
  }
}
