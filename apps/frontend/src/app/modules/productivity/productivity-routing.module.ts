// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductivityComponent } from './containers/productivity/productivity.component';

const routes: Routes = [
  {
    path: '',
    component: ProductivityComponent
    // canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductivityRoutingModule {}
