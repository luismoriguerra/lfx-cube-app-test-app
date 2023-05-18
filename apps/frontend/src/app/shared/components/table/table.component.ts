// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FilterService, InsightsFilters } from '@app/shared/services/filter.service';
import { Observable, switchMap, tap, combineLatest, filter, skip } from 'rxjs';
import { TableService } from '@app/shared/services/table.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AdditionalValues, TableColumnConfig, TableConfig } from '@app/core/models/table.model';
import { DownloadService } from '@app/shared/services/download.service';
@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'lfx-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  // TODO: fix this table config passing of template as it is causing an error on the console
  @Input() public tableConfiguration!: TableConfig;
  @Input() public tableRecords: Array<any> = [];
  @Input() public maxHeight: number = 520;
  @Input() public showNotIntegratedIcon: boolean = true;
  @Input() public tableName: string = '';
  @Input() public additionalValues: AdditionalValues;
  @Input() public isLoading: boolean = false;

  public noDataFound = false;
  protected filters$!: Observable<InsightsFilters>;

  public constructor(private tableService: TableService, public changeDetectorRef: ChangeDetectorRef, public filterService: FilterService) {
    this.filters$ = this.filterService.filter$.asObservable();

    // this.createAnnotations();
  }
  public ngOnInit() {
    // TableName means it ready for integration
    if (this.tableName) {
      this.loadData();
    }
  }

  public loadData(): void {
    // TODO: add hiding and showing of the loader icon
    combineLatest([this.filters$, this.tableService.tableMetricChange$])
      .pipe(
        skip(1),
        untilDestroyed(this),
        filter(([, changedTableName]) => {
          // when changedTableName length is zero means there is no changes done yet
          if (this.tableName !== changedTableName) {
            return false;
          }
          return true;
        }),
        tap(() => (this.tableConfiguration.isLoading = true)),
        switchMap(([filters]) => {
          this.additionalValues.isDesc = this.tableConfiguration.isDesc;
          return this.tableService.getTableData(this.tableName).pipe(untilDestroyed(this));
        })
      )
      .subscribe({
        next: (data: any) => {
          this.tableRecords = data.buckets ? data.buckets : data;
          this.tableConfiguration.isLoading = false;
        },
        error: (error) => {
          this.tableConfiguration.isLoading = false;
          this.noDataFound = false;
          this.tableConfiguration.error = false;
        }
      });
  }

  public onTryAgain() {
    this.noDataFound = false;
    this.tableConfiguration.error = false;
    this.tableService.tableMetricChange$.next(this.tableName);

    this.changeDetectorRef.detectChanges();
  }

  public changeSort(column: TableColumnConfig) {
    if (this.tableConfiguration.sortedBy === column.title) {
      this.tableConfiguration.isDesc = !this.tableConfiguration.isDesc;
    } else {
      this.tableConfiguration.sortedBy = column.title;
      this.tableConfiguration.isDesc = true;
    }
    this.onTryAgain();
  }

  protected showLoader(): void {
    this.tableConfiguration.isLoading = true;
    this.changeDetectorRef.detectChanges();
  }

  protected hideLoader(): void {
    this.tableConfiguration.isLoading = false;
    this.changeDetectorRef.detectChanges();
  }
}
