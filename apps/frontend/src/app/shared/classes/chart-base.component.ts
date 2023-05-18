// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';

import { FilterService, InsightsFilters } from '../services/filter.service';

// TODO: implment the date and project filters here
export abstract class ChartBaseComponent {
  public isLoading = false;
  public noDataFound = false;
  public errorResponse = false;
  protected filters$!: Observable<InsightsFilters>;

  public constructor(protected changeDetectorRef: ChangeDetectorRef, protected filterService: FilterService) {
    this.filters$ = this.filterService.filter$.asObservable();
  }

  public abstract checkEmptyData(chartConfig: any): boolean;
  public abstract loadData(): void;

  public onTryAgain() {
    this.isLoading = true;
    this.noDataFound = false;
    this.errorResponse = false;
    this.loadData();

    this.changeDetectorRef.detectChanges();
  }

  protected showLoader(): void {
    this.isLoading = true;
    this.changeDetectorRef.detectChanges();
  }

  protected hideLoader(): void {
    this.isLoading = false;
    this.changeDetectorRef.detectChanges();
  }

  protected checkNoDataFound(chartConfig: any) {
    if (!chartConfig.series?.length) {
      this.errorResponse = true;
    } else {
      this.errorResponse = false;

      if (this.checkEmptyData(chartConfig)) {
        this.noDataFound = true;
      } else {
        this.noDataFound = false;
      }
    }
    this.changeDetectorRef.detectChanges();
  }
}
