// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, of } from 'rxjs';

import { CubeService } from './cube.service';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  public tableMetricChange$ = new BehaviorSubject<string>('');
  public constructor(private cubeService: CubeService) {}

  public changeSelectedMetric(tableName: string) {
    this.tableMetricChange$.next(tableName);
  }

  public getTableData(tableName: string): Observable<any> {
    switch (tableName) {
      default:
        return of([]);
    }
  }
}
