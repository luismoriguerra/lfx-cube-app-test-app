// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AuthGuard } from '@auth0/auth0-angular';

const routes: Routes = [
  {
    // TODO: update this once we have actual global routes
    path: '',
    redirectTo: 'test-workspace/overview', // redirecting to fake project slug for now.
    pathMatch: 'full'
  },
  {
    path: ':projectSlug/overview',
    loadChildren: () => import('./modules/overview/overview.module').then((e) => e.OverviewModule)
    // canActivate: [AuthGuard]
  },
  {
    path: ':projectSlug/velocity',
    loadChildren: () => import('./modules/velocity/velocity.module').then((e) => e.VelocityModule)
    // canActivate: [AuthGuard]
  },
  {
    path: ':projectSlug/stability',
    loadChildren: () => import('./modules/stability/stability.module').then((e) => e.StabilityModule)
    // canActivate: [AuthGuard]
  },
  {
    path: ':projectSlug/productivity',
    loadChildren: () => import('./modules/productivity/productivity.module').then((e) => e.ProductivityModule)
    // canActivate: [AuthGuard]
  },
  { path: 'playground', loadChildren: () => import('./modules/playground/playground.module').then((m) => m.PlaygroundModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
