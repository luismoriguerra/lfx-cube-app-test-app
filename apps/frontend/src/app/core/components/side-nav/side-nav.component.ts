// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '@app/shared/services/project.service';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'lfx-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  @Output() public readonly toggleCollapsed = new EventEmitter<any>();
  public activeIdx: number = 0;
  public isCollapsed = false;
  public selectedProject: any;
  public menuItems: {
    name: string;
    icon: IconProp;
    activeIcon: IconProp;
    url: string;
  }[];

  public constructor(private projectService: ProjectService, private router: Router, private activatedRoute: ActivatedRoute) {}

  public ngOnInit(): void {
    this.onResize(window.innerWidth);
    this.projectService.$selectedProject.subscribe((project) => {
      this.selectedProject = project;
      this.updateMenuItems();
      this.updateSelectedTab();
      // this.router.navigate(['']);
      if (this.router.url === '/') {
        return;
      }

      this.router.navigate([this.menuItems[this.activeIdx].url], { queryParams: this.activatedRoute.snapshot.queryParams });
      window.scrollTo(0, 0);
    });
  }

  @HostListener('window:resize', ['$event.target.innerWidth'])
  public onResize(width: number) {
    const prev = this.isCollapsed;
    const limitWindow = 769;
    const newWidthSize = width < limitWindow;
    this.isCollapsed = newWidthSize;
    if (prev !== newWidthSize) {
      this.toggleCollapsed.emit();
    }
  }

  public updateMenuItems() {
    this.menuItems = [
      {
        name: 'Overview',
        icon: ['far', 'analytics'],
        activeIcon: ['fas', 'analytics'],
        url: `${this.selectedProject.slug}/overview`
      },
      {
        name: 'Velocity',
        icon: ['far', 'tachometer-alt-fastest'],
        activeIcon: ['fas', 'tachometer-alt-fastest'],
        url: `${this.selectedProject.slug}/velocity`
      },
      {
        name: 'Productivity',
        icon: ['far', 'user-check'],
        activeIcon: ['fas', 'user-check'],
        url: `${this.selectedProject.slug}/productivity`
      },
      {
        name: 'Stability',
        icon: ['far', 'shield-check'],
        activeIcon: ['fas', 'shield-check'],
        url: `${this.selectedProject.slug}/stability`
      }
    ];
  }

  public updateSelectedTab() {
    // TODO: fix this when we start using live data
    this.menuItems.forEach((m, i: number) => {
      if (window.location.href.indexOf(m.url) > 0) {
        this.activeIdx = i;
      }
    });
  }

  public toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
    this.toggleCollapsed.emit();
  }
}
