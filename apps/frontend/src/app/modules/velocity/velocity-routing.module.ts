// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VelocityComponent } from './containers/velocity/velocity.component';

const routes: Routes = [
  {
    path: '',
    component: VelocityComponent
    // canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VelocityRoutingModule {}
