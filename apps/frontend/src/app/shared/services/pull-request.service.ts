// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Injectable } from '@angular/core';
import { PRTimeSize } from 'lfx-insights';
import { CubejsClient } from '@cubejs-client/ngx';
import { Query, ResultSet } from '@cubejs-client/core';
import { Observable, of, switchMap } from 'rxjs';
import { LEAD_TIME_PR } from '../cubejs/metrics/pull-request/pull-request.queries';
import { InsightsFilters } from './filter.service';

@Injectable({
  providedIn: 'root'
})
export class PullRequestService {
  public constructor(private cubejs: CubejsClient) {}

  // TODO: change this to stream instead
  public getLeadTimeByPR(params: InsightsFilters): Observable<PRTimeSize[]> {
    const query: Query = LEAD_TIME_PR(params);

    const source$ = this.cubejs.load(query);
    // const resultSet = await firstValueFrom(source$);

    return source$.pipe(
      switchMap((resultSet: ResultSet<any>) => {
        const tmp: PRTimeSize[] = [];
        let largestAvg = 0;
        const colors = ['#0068fa', '#bd6bff', '#46b6c7', '#ff3185', '#0039b8'];
        /**
         * length of color in the bar is meant to show which of these PR buckets took how much time.
         * The greater the time it took (avg) the longer the bar or the color inside the bar.
         */

        resultSet.rawData().forEach((r) => {
          const avg = r['PullRequests.hoursTotal'] / r['PullRequests.count'];

          if (avg > largestAvg) {
            largestAvg = avg;
          }

          tmp.push({
            lines: r['PullRequests.bucket'] + ' Lines',
            prCount: +r['PullRequests.count'],
            progress: 0, //progress[+r['PullRequests.bucketId'] - 1],
            timeAvg: avg, // in seconds
            timeScale: this.convertSecs(avg),
            color: colors[+r['PullRequests.bucketId'] - 1]
          });
        });

        // looping over the data again to set the progress based on the largest value
        tmp.forEach((d: PRTimeSize, idx: number) => {
          tmp[idx].progress = (d.timeAvg / largestAvg) * 100;
        });

        return of(tmp);
      })
    );
  }

  private convertSecs(secs: number): string {
    const hours = secs / 3600;
    return `${hours > 48 ? Math.round(hours / 24) : hours.toFixed(2)} ${hours > 48 ? ' days' : ' hours'}`;
  }
}
