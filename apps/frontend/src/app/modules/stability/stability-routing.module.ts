// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StabilityComponent } from './containers/stability/stability.component';

const routes: Routes = [
  {
    path: '',
    component: StabilityComponent
    // canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StabilityRoutingModule {}
