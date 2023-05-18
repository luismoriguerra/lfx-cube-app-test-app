// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from './../../shared/shared.module';
import { PlaygroundRoutingModule } from './playground-routing.module';
import { PlaygroundComponent } from './playground.component';
import { CubejsChartExampleComponent } from './components/cubejs-chart-example/cubejs-chart-example.component';

@NgModule({
  declarations: [PlaygroundComponent, CubejsChartExampleComponent],
  imports: [CommonModule, PlaygroundRoutingModule, FormsModule, ReactiveFormsModule, SharedModule]
})
export class PlaygroundModule {}
