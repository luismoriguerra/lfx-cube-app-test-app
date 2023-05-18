/* eslint-disable @typescript-eslint/prefer-for-of */
// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import { ShortNumberPipe } from '../pipes/short-number.pipe';
@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  private readToDownloadCSVMap = new Map<string, { cardName: string; data: any }>();
  public constructor(private shortNumber: ShortNumberPipe) {}

  public download(elementRef: string | HTMLElement, title: string): void {
    let visualization;
    if (typeof elementRef === 'string') {
      visualization = document.getElementById(elementRef);
    } else {
      visualization = elementRef;
    }

    if (!visualization) {
      return;
    }

    html2canvas(visualization as HTMLElement, {
      scrollY: window.pageYOffset * -1 + 80,
      scrollX: window.pageXOffset * -1,
      useCORS: true,
      scale: 2,
      imageTimeout: 0,
      onclone(_, element) {
        const icons = element.getElementsByClassName('status-icon');
        const legendIcons = element.getElementsByClassName('legend-icon');
        const tables = element.getElementsByClassName('table-component-container');
        for (let i = 0; i < legendIcons.length; i++) {
          const legendIcon = legendIcons[i] as HTMLElement;
          legendIcon.style.marginTop = '15px';
        }
        for (let i = 0; i < icons.length; i++) {
          const icon = icons[i] as HTMLElement;
          if (icon.children && icon.children.length) {
            (icon.children[0] as HTMLElement).style.marginTop = '13px';
          }
        }
        for (let i = 0; i < tables.length; i++) {
          const table = tables[i] as HTMLElement;
          table.style.display = 'flex';
        }
      }
    }).then((_canvas) => {
      this.saveAs(_canvas.toDataURL(), title + '.png');
    });
  }

  public downloadCSV(title: string, data: any) {
    this.saveAs('data:text/csv;charset=utf-8,' + encodeURI(this.generateCSVFile(data)), title + '.csv');
  }

  public updateReadToDownload(cardName: string, data: any) {
    this.readToDownloadCSVMap.set(cardName, { cardName, data });
  }

  public getReadToDownloadCard(cardName: string) {
    return this.readToDownloadCSVMap.get(cardName);
  }

  private generateCSVFile(data: any[]) {
    let csvContent = '';
    csvContent += this.getCSVHeaders(data[0]);
    data.forEach((e) => {
      csvContent += this.mapObjectValueForCSV(e);
    });
    return csvContent;
  }

  private getCSVHeaders(obj: any, withoutEndLine?: boolean) {
    let csvHeader = '';
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === 'object') {
          csvHeader += this.getCSVHeaders(obj[key], true);
        } else {
          csvHeader += key + ',';
        }
      }
    }
    return csvHeader + (withoutEndLine ? '' : '\n');
  }

  private mapObjectValueForCSV(obj: any, withoutEndLine?: boolean): string {
    return (
      Object.values(obj)
        .map((i: any) => {
          if (typeof i === 'string' && i.includes(',')) {
            return `"${i}"`;
          }
          if (typeof i === 'number') {
            return `${this.shortNumber.transform(i)}`;
          }
          if (typeof i === 'object') {
            return this.mapObjectValueForCSV(i, true);
          }
          return i;
        })
        .join(',') + (withoutEndLine ? '' : '\n')
    );
  }

  private saveAs(uri: string, filename: string) {
    const link = document.createElement('a');

    if (typeof link.download === 'string') {
      link.href = uri;
      link.download = filename;
      // Firefox requires the link to be in the body
      document.body.appendChild(link);
      // simulate click
      link.click();
      // remove the link when done
      document.body.removeChild(link);
    } else {
      window.open(uri);
    }
  }
}
