// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { PivotConfig, Query, ResultSet } from '@cubejs-client/core';
import { cubeCrowdProjsRepos } from '../../cubes/CrowdProjsRepos';

// Cube Query
export const allProjects = (): Query => {
  const query: Query = {
    segments: [],
    dimensions: [cubeCrowdProjsRepos.dimensions.project_id, cubeCrowdProjsRepos.dimensions.project_name, cubeCrowdProjsRepos.dimensions.project_slug],
    filters: [],
    measures: [],
    timeDimensions: []
  };
  return query;
};

export const projectRepositories = (projectSlug: string): Query => {
  const query: Query = {
    filters: [
      {
        member: cubeCrowdProjsRepos.dimensions.project_slug,
        operator: 'equals',
        values: [projectSlug]
      }
    ],
    dimensions: [cubeCrowdProjsRepos.dimensions.project_id, cubeCrowdProjsRepos.dimensions.project_name, cubeCrowdProjsRepos.dimensions.repository_url],
    // INFO we only support one repository per project by now
    limit: 1
  };
  return query;
};

const allProjectPivotConfig: PivotConfig = {
  x: [cubeCrowdProjsRepos.dimensions.project_id, cubeCrowdProjsRepos.dimensions.project_name, cubeCrowdProjsRepos.dimensions.project_slug],
  y: [],
  fillMissingDates: false
};

// Cube result to amchart
export function allProjectsMap(resultSet: ResultSet<any>) {
  const resultSeries = resultSet.tablePivot(allProjectPivotConfig);

  if (!resultSeries || !resultSeries.length) {
    return [];
  }

  return resultSeries.map((cubePivotRow: any) => ({
    id: cubePivotRow[cubeCrowdProjsRepos.dimensions.project_id],
    name: cubePivotRow[cubeCrowdProjsRepos.dimensions.project_name],
    slug: cubePivotRow[cubeCrowdProjsRepos.dimensions.project_slug]
  }));
}

const projectRepositoriesPivotConfig: PivotConfig = {
  x: [cubeCrowdProjsRepos.dimensions.project_id, cubeCrowdProjsRepos.dimensions.project_name, cubeCrowdProjsRepos.dimensions.repository_url],
  y: [],
  fillMissingDates: false
};

// Cube result to amchart
export function projectRepositoriesMap(resultSet: ResultSet<any>) {
  const resultSeries = resultSet.tablePivot(projectRepositoriesPivotConfig);

  if (!resultSeries || !resultSeries.length) {
    return [];
  }

  return resultSeries.map((cubePivotRow: any) => ({
    projectId: cubePivotRow[cubeCrowdProjsRepos.dimensions.project_id],
    projectName: cubePivotRow[cubeCrowdProjsRepos.dimensions.project_name],
    name: cubePivotRow[cubeCrowdProjsRepos.dimensions.repository_url]
  }));
}
