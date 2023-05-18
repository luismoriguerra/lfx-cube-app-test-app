// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StabilityRoutingModule } from './stability-routing.module';
import { StabilityComponent } from './containers/stability/stability.component';

@NgModule({
  declarations: [StabilityComponent],
  imports: [CommonModule, StabilityRoutingModule]
})
export class StabilityModule {}
