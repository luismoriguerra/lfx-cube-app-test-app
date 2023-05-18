// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Component, Input } from '@angular/core';
import { metricDetails } from '@app/shared/mock-data/metric-details';
import { faExternalLinkAlt } from '@fortawesome/pro-light-svg-icons';
import { faCheckCircle, faFileAlt, faTimesCircle } from '@fortawesome/pro-regular-svg-icons';

@Component({
  selector: 'lfx-metric-details',
  templateUrl: './metric-details.component.html',
  styleUrls: ['./metric-details.component.scss']
})
export class MetricDetailsComponent {
  @Input() public key: string = '';
  public icons = {
    faExtLink: faExternalLinkAlt,
    faCircleXMark: faTimesCircle,
    faCircleCheck: faCheckCircle,
    faFile: faFileAlt
  };

  public metricDetails = metricDetails;

  public getCurrentMetric(): any {
    const metric = this.metricDetails.find((x) => x.key === this.key);
    return metric && metric.metricInfo;
  }
}
