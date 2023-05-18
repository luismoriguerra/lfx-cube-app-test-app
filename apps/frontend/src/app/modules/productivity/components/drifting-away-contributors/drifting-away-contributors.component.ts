// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { TableConfig } from '@app/core/models/table.model';

@Component({
  selector: 'lfx-drifting-away-contributors',
  templateUrl: './drifting-away-contributors.component.html',
  styleUrls: ['./drifting-away-contributors.component.scss']
})
export class DriftingAwayContributorsComponent implements OnInit, AfterViewInit {
  @ViewChild('numberTemplate') private numberTemplate!: TemplateRef<any>;
  @ViewChild('githubNameTemplate') private githubNameTemplate!: TemplateRef<any>;
  @ViewChild('contributionsTemplate') private contributionsTemplate!: TemplateRef<any>;

  public tableConfiguration: TableConfig;
  public tableRecords = [
    {
      rank: '1',
      name: 'Mostapha Sadeghipour Roudsari',
      githubUsername: 'mostaphaRoudsari',
      contributions: {
        value: 428,
        changeFromPrevious: 57
      }
    },
    {
      rank: '2',
      name: 'Chandan Sharma',
      githubUsername: 'chandsharma',
      contributions: {
        value: 364,
        changeFromPrevious: 22
      }
    },
    {
      rank: '3',
      name: 'Wanlong Chen',
      githubUsername: 'c202c',
      contributions: {
        value: 341,
        changeFromPrevious: 31
      }
    },
    {
      rank: '4',
      name: 'Rahul Roshan Kachchap',
      githubUsername: 'rahulroshan-kachchap',
      contributions: {
        value: 285,
        changeFromPrevious: 18
      }
    },
    {
      rank: '5',
      name: 'Mahmoud Atwa',
      githubUsername: 'atwamahmoud',
      contributions: {
        value: 236,
        changeFromPrevious: 5
      }
    },
    {
      rank: '6',
      name: 'Paul Yu',
      githubUsername: 'pauldotyu',
      contributions: {
        value: 214,
        changeFromPrevious: -11
      }
    },
    {
      rank: '7',
      name: 'Vicente JJ. Miras',
      githubUsername: 'vjjmiras',
      contributions: {
        value: 186,
        changeFromPrevious: 6
      }
    },
    {
      rank: '8',
      name: 'Lie Ryan',
      githubUsername: 'lieryan',
      contributions: {
        value: 167,
        changeFromPrevious: 41
      }
    },
    {
      rank: '9',
      name: 'Joe Atzinger',
      githubUsername: 'joe-atzinger',
      contributions: {
        value: 144,
        changeFromPrevious: -22
      }
    },
    {
      rank: '10',
      name: 'Aakarshan Chauhan',
      githubUsername: 'Aakarshan-369',
      contributions: {
        value: 139,
        changeFromPrevious: 18
      }
    },
    {
      rank: '11',
      name: 'Daniel Seymour',
      githubUsername: 'thefirstofthe300',
      contributions: {
        value: 131,
        changeFromPrevious: -11
      }
    },
    {
      rank: '12',
      name: 'Derik Evangelista',
      githubUsername: 'kirederik',
      contributions: {
        value: 129,
        changeFromPrevious: 6
      }
    },
    {
      rank: '13',
      name: 'Yordis Prieto',
      githubUsername: 'yordis',
      contributions: {
        value: 122,
        changeFromPrevious: 41
      }
    },
    {
      rank: '14',
      name: 'Zane Williamson',
      githubUsername: 'sepulworld',
      contributions: {
        value: 117,
        changeFromPrevious: -22
      }
    },
    {
      rank: '15',
      name: 'Johann Gnaucke',
      githubUsername: 'Wieneo',
      contributions: {
        value: 114,
        changeFromPrevious: 18
      }
    }
  ];

  public constructor(public elementRef: ElementRef) {}

  public ngOnInit() {}

  public ngAfterViewInit(): void {
    this.tableConfiguration = {
      sortedBy: 'Rank',
      columns: [
        {
          title: 'Rank',
          key: 'rank',
          columnCssClass: 'justify-center text-center',
          headerCssClass: 'justify-center text-center !font-arial',
          width: '16%',
          template: this.numberTemplate,
          sortable: true
        },
        {
          title: 'Contributor',
          key: 'name',
          columnCssClass: '',
          headerCssClass: '',
          width: '50%',
          template: this.githubNameTemplate
        },
        {
          title: 'Contributions',
          key: 'contributions',
          columnCssClass: 'justify-center text-center',
          headerCssClass: 'justify-center text-center',
          width: '34%',
          template: this.contributionsTemplate
        }
      ]
    };
  }
}
