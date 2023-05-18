// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DownloadService } from '@app/shared/services/download.service';

@Component({
  selector: 'lfx-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {
  @Input() public visualization: string | HTMLElement;
  @Input() public title: string;
  @Input() public cardName: string;
  @Input() public isLoading = false;
  @Output() public readonly exportCSV = new EventEmitter<any>();
  public constructor(private downloadService: DownloadService) {}

  public ngOnInit() {}

  public downloadPNG() {
    this.exportCSV.emit();
    this.downloadService.download(this.visualization, this.title + '-' + new Date().getTime());
  }

  public downloadCSV() {
    this.exportCSV.emit();
    const card = this.downloadService.getReadToDownloadCard(this.cardName);
    if (card) {
      this.downloadService.downloadCSV(this.title, card.data);
    }
  }
}
