// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT
import { time } from '@amcharts/amcharts5';
import { Percent } from '@amcharts/amcharts5';
import { GranularityEnum } from './filters';

// TODO: reconsider how these chart keys get used in pulling data from the API
export const enum ChartNames {
  CommitsPerDayLineChart = 'CommitsPerDayLineChart',
  WorkTimeDistribution = 'WorkTimeDistribution',
  WorkTimeDistributionBar = 'WorkTimeDistributionBar',
  AverageWaitTime1stReview = 'AverageWaitTime1stReview',
  TimeToMergePR = 'TimeToMergePR',
  BuildFrequencyLineChart = 'BuildFrequencyLineChart',
  PullRequestSizeBreakdown = 'PullRequestSizeBreakdown',
  BuildFailureRateBarChart = 'BuildFailureRateBarChart',
  ContributorsFull = 'Contributors-full',
  ContributorsMini = 'Contributors-mini',
  SummaryContributors = 'summary-contributors',
  ContributorsByCountry = 'ContributorsByCountry',
  CommitsFull = 'Commits-full',
  CommitsMini = 'Commits-mini',
  SummaryCommits = 'summary-commits',
  IssuesFull = 'Issues-full',
  IssuesMini = 'Issues-mini',
  PullRequestsFull = 'Pull-Requests-full',
  PullRequestsMini = 'Pull-Requests-mini',
  SummaryIssues = 'summary-issues',
  ForksFull = 'Forks-full',
  ForksMini = 'Forks-mini',
  SummaryForks = 'summary-Forks',
  StarsFull = 'stars-full',
  StarsMini = 'stars-mini',
  ActiveDaysChart = 'ActiveDaysChart',
  engagementGapChart = 'engagement-gap-chart',
}

export interface CommonChartConfig {
  showLegend?: boolean;
  yAxisName?: string;
  height?: number;
  max?: number;
}

// Add all the chart related interfaces here

export interface AnnotationSettings {
  verticalAlign: string;
  horizontalAlign: string;
  template: string;
}

export interface BarChartConfig extends CommonChartConfig {
  type?: 'normal' | 'stacked' | 'reversedStacked';
  series: ColumnSeriesSettings[];
  xAxis?: AxisSettings;
  direction?: 'vertical' | 'horizontal';
  barWidth?: number | Percent | null;
  annotationSettings?: AnnotationSettings;
  targetValue?: number;
  useMicroTheme?: boolean;
}

export interface HeatChartConfig {
  height: number;
  categoryYField: string;
  valueField: string;
  categoryXField: string;
  startColor: string;
  endColor: string;
  startText: string;
  endText: string;
}

export interface bubbleChartConfig {
  data: bubbleChartDataElement[];
  height: number;
}

export interface bubbleChartDataElement {
  name: string;
  value: number;
  color: string;
}
export interface GaugeChartConfig {
  ranges: GaugeCHartRange[];
  height: number;
  innerRadius: number;
  /**
   * Value in percent. range 0 -> 100
   */
  value: number;
  spriteRadius: number;
}

export interface GaugeCHartRange {
  text: string;
  color: string;
  value: number;
  endValue: number;
}

export interface ColumnSeriesSettings {
  name: string;
  valueYField: string;
  categoryXField?: string;
  valueXField?: string;
  color?: string;
}

export interface AxisSettings {
  field: string;
  axisType: 'category' | 'date';
  granularity?: GranularityEnum;
  dateFormats?: { [index: string]: string | Intl.DateTimeFormatOptions };
  groupData?: boolean;
}

export interface LineSeriesSettings {
  field: string;
  name: string;
  color?: string;
  bullets?: boolean;
}

export interface LineChartConfig extends CommonChartConfig {
  type?: 'smooth' | 'straight';
  series: LineSeriesSettings[];
  xAxis: AxisSettings;
  annotationSettings?: AnnotationSettings;
  useMicroTheme?: boolean;
  targetValue?: number;
}

export interface MapSeriesSettings {
  idField: string;
  valueField: string;
  calculateAggregates?: boolean;
}

export interface MapChartConfig extends CommonChartConfig {
  series: MapSeriesSettings;
  min?: number;
  max?: number;
  minValue?: number;
  maxValue?: number;
  annotationSettings?: AnnotationSettings;
  tooltipHTML?: string;
}
