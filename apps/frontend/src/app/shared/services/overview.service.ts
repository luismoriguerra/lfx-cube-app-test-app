// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT
import { Injectable } from '@angular/core';
import { BestPracticeScores, ContributorDependency } from 'lfx-insights';
import { CubejsClient } from '@cubejs-client/ngx';
import { Query, ResultSet } from '@cubejs-client/core';
import { Observable, of, switchMap } from 'rxjs';
import { bestPracticeScore } from '../cubejs/metrics/best-practices/BestPracticesScores';
import { contributorDependenciesActivities } from '../cubejs/metrics/activities/ContributorDependencyActivities';
import { cubeActivities } from '../cubejs/cubes/Activities';
import { InsightsFilters } from './filter.service';

@Injectable({
  providedIn: 'root'
})
export class OverviewService {
  public constructor(private cubejs: CubejsClient) {}

  public getBestPracticeScores(params: InsightsFilters): Observable<BestPracticeScores[]> {
    const query: Query = bestPracticeScore(params);

    const source$ = this.cubejs.load(query);

    return source$.pipe(
      switchMap((resultSet: ResultSet<any>) => {
        const tmp: BestPracticeScores[] = [];
        // this should only return 1 or 0 row
        resultSet.rawData().forEach((r) => {
          tmp.push({
            repositoryURL: r['BestPracticeScore.repositoryUrl'],
            repositoryId: r['BestPracticeScore.repositoryId'],
            globalScore: Math.round(r['BestPracticeScore.globalScore']),
            documentationScore: r['BestPracticeScore.documentationScore'],
            licenseScore: r['BestPracticeScore.licenseScore'],
            bestPracticesScore: r['BestPracticeScore.bestPracticesScore'],
            securityScore: r['BestPracticeScore.securityScore'],
            legalScore: r['BestPracticeScore.legalScore']
          });
        });
        return of(tmp);
      })
    );
  }

  public getContributorDependency(params: InsightsFilters, type: string, usePrevious: boolean): Observable<ContributorDependency[]> {
    // TODO: remove this later
    // the filter repository currently has a default kubernetes/kubernetes filter which shouldn't be
    // however other components might be using that right now
    const newFilter = { ...params };
    if (newFilter.repositories?.length === 1 && newFilter.repositories[0] === 'kubernetes/kubernetes') {
      newFilter.repositories = [];
    }
    const query: Query = contributorDependenciesActivities(newFilter, type, usePrevious);

    const source$ = this.cubejs.load(query);

    return source$.pipe(
      switchMap((resultSet: ResultSet<any>) => {
        const tmp: ContributorDependency[] = [];
        // this should only return 1 or 0 row
        resultSet.rawData().forEach((r) => {
          tmp.push({
            name: r[cubeActivities.dimensions.username],
            logoUrl: r['Members.logo_url'],
            userId: r[cubeActivities.dimensions.memberId],
            date: r[cubeActivities.dimensions.timestamp],
            contributions: {
              value: +r[cubeActivities.measures.count],
              percent: 0,
              changeFromPrevious: 0
            }
          });
        });
        return of(tmp);
      })
    );
  }
}
