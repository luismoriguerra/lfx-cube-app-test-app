// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { Query } from '@cubejs-client/core';
import { CubejsClient } from '@cubejs-client/ngx';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { projects } from '../mock-data/projects';

// Testing loading of commits
interface CubeCommits {
  'Commit.project_id': string;
  'Commit.commit_id': string;
  'Commit.hash': string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private selectedProjectSubject = new BehaviorSubject(projects[0]);
  public $selectedProject: Observable<any> = this.selectedProjectSubject.asObservable();
  public constructor(private cubejs: CubejsClient) {}

  public changeSelectedProject(newProject: any) {
    this.selectedProjectSubject.next(newProject);
  }

  // test loading commits
  public async getCommitsThisMonth(): Promise<CubeCommits[]> {
    const query: Query = {
      dimensions: ['Commit.project_id', 'Commit.commit_id', 'Commit.hash'],
      order: {
        'Commit.project_id': 'asc'
      },
      timeDimensions: [
        {
          dimension: 'Commit.createdat',
          granularity: 'day',
          dateRange: 'This month'
        }
      ]
    };

    const source$: any = this.cubejs.load(query);
    const resultSet: any = await firstValueFrom(source$);
    const tablePivot: any = resultSet.tablePivot();
    return tablePivot;
  }
}
