// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsModule } from '@app/shared/module/icons.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AvatarModule } from 'ngx-avatar';
import { InputComponent } from './components/input/input.component';
import { ContentHeaderComponent } from './components/content-header/content-header.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { TableComponent } from './components/table/table.component';
import { ShortNumberPipe } from './pipes/short-number.pipe';
import { DateRangeFilterComponent } from './components/date-range-filter/date-range-filter.component';
import { GaugeChartComponent } from './components/gauge-chart/gauge-chart.component';
import { HeatChartComponent } from './components/heat-chart/heat-chart.component';
import { DialogTemplateComponent } from './components/dialog-template/dialog-template.component';
import { TextCopyBlockComponent } from './components/text-copy-block/text-copy-block.component';
import { CircleProgressComponent } from './components/circle-progress/circle-progress.component';
import { CalculatedCardHeaderComponent } from './components/calculated-card-header/calculated-card-header.component';
import { ForceDirectedChartComponent } from './components/force-directed-chart/force-directed-chart.component';
import { TopFiltersComponent } from './components/top-filters/top-filters.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { BoldPhrasePipe } from './pipes/bold-phrase.pipe';
import { IconIndicatorPipe } from './pipes/icon-indicator.pipe';
import { LoadingComponent } from './components/loading/loading.component';
import { DownloadComponent } from './components/download/download.component';
import { PositionElementDirective } from './directives/position-element.directive';
import { MapChartComponent } from './components/map-chart/map-chart.component';
import { FirstLettersPipe } from './pipes/first-letters.pipe';
import { CalculatePercentagePipe } from './pipes/calculate-percentage.pipe';
import { AsyncNumberPipe } from './pipes/asyncNumber.pipe';
import { NumberColorPipe } from './pipes/number-color.pipe';
import { IconStatusPipe } from './pipes/icon-status.pipe';
import { ValueChangePipe } from './pipes/value-change.pipe';
import { WipComponent } from './components/wip/wip.component';
import { AbsoluteValuePipe } from './pipes/absoluteValue.pipe';

@NgModule({
  declarations: [
    InputComponent,
    ContentHeaderComponent,
    BarChartComponent,
    HeatChartComponent,
    TableComponent,
    ClickOutsideDirective,
    ShortNumberPipe,
    DateRangeFilterComponent,
    GaugeChartComponent,
    DialogTemplateComponent,
    TextCopyBlockComponent,
    CircleProgressComponent,
    CalculatedCardHeaderComponent,
    ForceDirectedChartComponent,
    TopFiltersComponent,
    LineChartComponent,
    ProgressBarComponent,
    BoldPhrasePipe,
    IconIndicatorPipe,
    LoadingComponent,
    DownloadComponent,
    PositionElementDirective,
    MapChartComponent,
    FirstLettersPipe,
    CalculatePercentagePipe,
    AsyncNumberPipe,
    NumberColorPipe,
    IconStatusPipe,
    ValueChangePipe,
    AbsoluteValuePipe,
    WipComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IconsModule,
    NgSelectModule,
    MatDialogModule,
    MatMenuModule,
    MatTabsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AvatarModule
  ],
  providers: [ShortNumberPipe],
  exports: [
    ReactiveFormsModule,
    InputComponent,
    IconsModule,
    ContentHeaderComponent,
    BarChartComponent,
    HeatChartComponent,
    TableComponent,
    ClickOutsideDirective,
    ShortNumberPipe,
    IconIndicatorPipe,
    FirstLettersPipe,
    BoldPhrasePipe,
    NgSelectModule,
    MatDialogModule,
    MatMenuModule,
    MatTabsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    GaugeChartComponent,
    MatCheckboxModule,
    DateRangeFilterComponent,
    DialogTemplateComponent,
    TextCopyBlockComponent,
    CircleProgressComponent,
    CalculatedCardHeaderComponent,
    ForceDirectedChartComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    TopFiltersComponent,
    LineChartComponent,
    ProgressBarComponent,
    LoadingComponent,
    DownloadComponent,
    PositionElementDirective,
    MapChartComponent,
    CalculatePercentagePipe,
    AsyncNumberPipe,
    NumberColorPipe,
    AvatarModule,
    IconStatusPipe,
    ValueChangePipe,
    AbsoluteValuePipe,
    WipComponent
  ]
})
export class SharedModule {}
