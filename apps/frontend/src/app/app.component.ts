// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component, OnInit } from '@angular/core';

import { environment } from '@environments/environment';
import { environment as datadogEnv } from '@environments/environment.datadog';
import { UntilDestroy } from '@ngneat/until-destroy';
import { datadogRum } from '@datadog/browser-rum';
import { ProjectService } from './shared/services/project.service';

import { HTTPService } from './shared/services/http.service';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'lfx-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isCollapsed = false;
  public constructor(private httpService: HTTPService, private projectService: ProjectService) {}

  public ngOnInit(): void {
    this.loadLFxHeaderScriptAndLinks();
  }

  public toggleCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }

  private loadLFxHeaderScriptAndLinks() {
    this.setScript().then(() => {
      const header: any = document.getElementById('lfx-header');

      if (header) {
        header.product = 'LF DA';
        header.docslink = 'https://docs.linuxfoundation.org/lfx/insights/v2-current';
        header.supportlink = 'https://jira.linuxfoundation.org/plugins/servlet/desk/portal/4?requestGroup=54';
        header.links = [
          {
            title: 'Enroll Project',
            url: 'https://jira.linuxfoundation.org/plugins/servlet/theme/portal/4/create/341',
            target: '_blank'
          }
        ];

        header.beforeLogout = () => {
          window.localStorage.removeItem('accessIdentity');
        };

        // INFO: Still in progress https://github.com/LF-Engineering/lfx-header#search-wip--dev-only
        // TODO: hidden up to have ready search design
        // header.searchobj = {
        //   placeholder: 'Search by Project, Repository...',
        //   loading: 'Loading Data...',
        //   notFound: 'No Items Found.',
        //   searchfunc: (searchText: string) => {},
        //   selectItem: () => {},
        //   value: null
        // };

        this.loadDataDogScript();
        // TODO: add this once we have the authentication setup
        // this.authService.user$.subscribe((data: any) => {
        //   this.loadDataDogScript();

        //   if (data) {
        //     header.authuser = data;

        //     datadogRum.setUser({
        //       id: data['https://sso.linuxfoundation.org/claims/username']
        //     });
        //   }
        // });
      }
    });
  }

  private async setScript() {
    return await this.injectScript(environment.lfxHeader + '/lfx-header-v2.js');
  }

  private injectScript(src: string): Promise<any> {
    if (this.isScriptLoaded(src)) {
      return Promise.resolve(true);
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');

      script.src = src;
      script.addEventListener('load', resolve);
      script.addEventListener('error', (e) => reject(e.error));
      document.head.appendChild(script);
    });
  }

  private isScriptLoaded(url: string): boolean {
    const scripts = document.getElementsByTagName('script');

    for (let i = scripts.length; i--; ) {
      if (scripts[i].src === url) {
        return true;
      }
    }

    return false;
  }

  private loadDataDogScript() {
    if (!datadogRum.getInitConfiguration()) {
      datadogRum.init({
        applicationId: datadogEnv.datadogAppID,
        clientToken: datadogEnv.datadogToken,
        site: 'datadoghq.com',
        service: 'lfx-insights-v3',
        env: environment.datadogEnv,
        sessionSampleRate: 100,
        sessionReplaySampleRate: 20,
        trackUserInteractions: true,
        trackResources: true,
        trackLongTasks: true,
        defaultPrivacyLevel: 'mask-user-input'
      });

      datadogRum.startSessionReplayRecording();
    }
  }
}
