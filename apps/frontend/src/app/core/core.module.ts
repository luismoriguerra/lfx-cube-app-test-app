// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { ToolsMenuComponent } from './components/tools-menu/tools-menu.component';

@NgModule({
  declarations: [SideNavComponent, PageHeaderComponent, ToolsMenuComponent],
  imports: [CommonModule, SharedModule, RouterModule],
  exports: [SideNavComponent, PageHeaderComponent]
})
export class CoreModule {}
