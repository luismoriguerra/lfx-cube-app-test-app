// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { allProjects, allProjectsMap, projectRepositories, projectRepositoriesMap } from '@app/shared/cubejs/metrics/crowd-projects-repos/crowdProjectsRepos';
import { CubeService } from '@app/shared/services/cube.service';
import { FilterService } from '@app/shared/services/filter.service';
import { ProjectService } from '@app/shared/services/project.service';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'lfx-top-filters',
  templateUrl: './top-filters.component.html'
})
export class TopFiltersComponent implements OnInit {
  @ViewChild('topFilterComponent', { static: false }) public topFilterComponent!: ElementRef<HTMLElement>;

  @Input() public pageTitle: string;
  @Input() public projectName = 'The Linux Foundation';
  @Input() public description = `The Contributor License Agreement (CLA) service of the Linux Foundation lets project contributors read,
   sign, and submit contributor license agreements easily.`;

  @Output() public readonly filterDateSelectedChange = new EventEmitter<string>();
  @Output() public readonly filterHideBotsChange = new EventEmitter<boolean>();
  public selectedRepository = 'all';
  public repositoryDefaultOption = { id: 'all', name: 'All Repositories & Groups' };

  public repositories = [this.repositoryDefaultOption];

  public selectedProject: any;
  public projects: any[] = [];

  public componentFixed = false;
  public constructor(private projectService: ProjectService, private cubeService: CubeService, private filterService: FilterService) {}

  public resetRepositoryDropdown() {
    this.selectedRepository = 'all';
    this.repositories = [this.repositoryDefaultOption];
  }

  public ngOnInit() {
    this.getProjects();
    this.projectService.$selectedProject.subscribe((project) => {
      this.selectedProject = project;
      this.getProjectRepositories(project.slug);
    });
  }

  @HostListener('window:scroll', [])
  public onWindowScroll() {
    // Fix for the stuttering filter component. Used position absolute on the page title component instead of hiding/removing it
    if (this.topFilterComponent) {
      if (window.scrollY > 5) {
        this.topFilterComponent.nativeElement.classList.add('top-filters--fixed');
        this.componentFixed = true;
      } else {
        this.componentFixed = false;
        this.topFilterComponent.nativeElement.classList.remove('top-filters--fixed');
      }
    }
  }

  public updateSelectedProject() {
    this.projectService.changeSelectedProject(this.selectedProject);
    // TODO: need to recall all apis to update the data project id filter
    this.filterService.applyFilterPartially({
      project: this.selectedProject.id
    });
  }

  public updateSelectedRepository() {
    this.projectService.changeSelectedProject(this.selectedProject);
    // TODO: need to recall all apis to update the data project id filter
    this.filterService.applyFilterPartially({
      repositories: [this.selectedRepository]
    });
  }

  private getProjects() {
    this.cubeService.multipleTimeSeries$(allProjects(), allProjectsMap).subscribe((res) => {
      this.projects = [
        ...res
        // {
        //   id: PROJECT_CNCF,
        //   name: 'Kubernetes',
        //   slug: 'k8s'
        // }
      ];

      // set the default selected project
      if (this.projects.length > 0) {
        // TODO: remove this later, for now set the default project to easyCLA
        const defaultProj = this.projects.find((p) => p.name === 'EasyCLA');

        this.projectService.changeSelectedProject(defaultProj ? defaultProj : this.projects[0]);
      }
    });
  }

  private getProjectRepositories(projectSlug: string) {
    this.cubeService
      .multipleTimeSeries$(projectRepositories(projectSlug), projectRepositoriesMap)
      .subscribe((repositories: { projectId: string; projectName: string; name: string }[]) => {
        this.selectedRepository = 'all';
        const repos = repositories.map((repo) => ({
          id: repo.projectId,
          name: repo.name.replace(`https://github.com/`, '')
        }));
        this.repositories = [this.repositoryDefaultOption, ...repos];
      });
  }
}
