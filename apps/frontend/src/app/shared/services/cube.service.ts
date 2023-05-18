// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

// INFO for debugging
/* eslint-disable no-restricted-syntax */
import { Injectable } from '@angular/core';
import { PivotConfig, Query, ResultSet } from '@cubejs-client/core';
import { CubejsClient } from '@cubejs-client/ngx';
import { catchError, firstValueFrom, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '@environments/environment';
import { to } from 'await-to-js';
import { flattenColumns, getDisplayedColumns } from '../cubejs/helpers/utils';
import { traceTime } from '../utils';
import { logCubeQueries } from '../utils/debug-cube-queries';

@Injectable({
  providedIn: 'root'
})
export class CubeService {
  public constructor(private cubejs: CubejsClient) {}

  public tryInPlayground(query: Query) {
    const playgroundUrl = environment.cubejs.playgroundUrl;
    const queryUrl = `query=${encodeURIComponent(JSON.stringify(query))}`;
    const url = `${playgroundUrl}?${queryUrl}`;
    return url;
  }

  public async load(query: Query): Promise<any> {
    const done = traceTime();
    const playgroundUrl = this.tryInPlayground(query);
    let time = 0;
    logCubeQueries(playgroundUrl, time);

    const source$ = this.cubejs.load(query);
    const [err, resultSet] = await to(firstValueFrom(source$));
    time = done();
    // console.log('> flag', 3, { err, resultSet, playgroundUrl });

    if (err) {
      console.error('CubeService.load', err);
      console.log(`%c` + 'Error CUBE query' + JSON.stringify({ playgroundUrl, time }, null, 2), 'color: red');
      throw err;
    }

    logCubeQueries(playgroundUrl, time, resultSet);

    return resultSet;
  }

  public loadObs(query: Query): Observable<any> {
    const done = traceTime();
    const playgroundUrl = this.tryInPlayground(query);
    let time = 0;
    logCubeQueries(playgroundUrl, time);

    const source$ = this.cubejs.load(query);
    return source$.pipe(
      switchMap((resultSet: ResultSet<any>) => {
        time = done();
        logCubeQueries(playgroundUrl, time, resultSet);

        return of(resultSet);
      }),
      catchError((err: any) => {
        time = done();
        console.error('CubeService.load', err);
        console.log(`%c` + 'Error CUBE query' + JSON.stringify({ playgroundUrl, time }, null, 2), 'color: red');
        throw err;
      })
    );
  }

  public cubeQuery$(query: Query) {
    return this.cubejs.load(query).pipe(
      catchError((err) => {
        console.error('CubeService.cubeQuery$', err);
        const playgroundUrl = this.tryInPlayground(query);
        console.log('Error  CUBE query' + JSON.stringify({ playgroundUrl }, null, 2));
        throw err;
      })
    );
  }

  // https://codesandbox.io/s/f7uh84?file=/src/app/app.component.ts
  public async toNumber(resultSet: ResultSet<any>): Promise<number> {
    const numericValues = resultSet.seriesNames().map((s) => resultSet.totalRow()[s.key]);
    return numericValues[0];
  }

  public async getNumber(query: Query) {
    const resultSet = await this.load(query);
    return this.toNumber(resultSet);
  }

  public timeSeries$(query: Query) {
    return this.cubejs.load(query).pipe(
      map((resultSet) => {
        const resultSeries = resultSet.series();

        if (!resultSeries || !resultSeries.length) {
          return [];
        }

        const seriesData = resultSeries[0].series.map((item) => ({
          ...item,
          date: new Date(item.x).getTime()
        }));

        return seriesData;
      })
    );
  }

  public multipleTimeSeries$(query: Query, resultSetToChart: (resultSet: ResultSet<any>, additionalValues?: any) => any, additionalValues?: any) {
    return this.cubeQuery$(query).pipe(map((resultSet) => resultSetToChart(resultSet, additionalValues)));
  }

  public async getTable(query: Query, pivotConfig: PivotConfig) {
    const resultSet = await this.load(query);
    return this.toTable(resultSet, pivotConfig);
  }

  public getTableObs(query: Query, pivotConfig?: PivotConfig): Observable<any> {
    return this.loadObs(query).pipe(switchMap((resultSet) => of(this.toTable(resultSet, pivotConfig))));
  }

  public toTable(resultSet: ResultSet<any>, pivotConfig?: PivotConfig) {
    const tableData = resultSet.tablePivot(pivotConfig);
    const displayedColumns = getDisplayedColumns(resultSet.tableColumns(pivotConfig));
    const columnTitles = flattenColumns(resultSet.tableColumns(pivotConfig));

    return {
      tableData,
      displayedColumns,
      columnTitles
    };
  }

  // TODO: Refactor this
  public mapSeries$(query: Query) {
    return this.cubejs.load(query).pipe(
      map((resultSet) => {
        const tmp: any[] = [];
        resultSet.rawData().forEach((r) => {
          tmp.push({
            id: r['ContributorsByLocation.countryCode'],
            name: r['ContributorsByLocation.countryName'],
            value: +r['ContributorsByLocation.contributor_count']
          });
        });

        return tmp;
      })
    );
  }
}
