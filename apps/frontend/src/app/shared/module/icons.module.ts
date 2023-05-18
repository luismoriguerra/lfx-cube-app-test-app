// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { NgModule } from '@angular/core';
import { FaConfig, FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faAnalytics,
  faTachometerAltFastest,
  faShieldCheck,
  faUserCheck,
  faGlobe,
  faTimesCircle,
  faCaretDown,
  faCalendar,
  faChartLine,
  faChartLineDown,
  faArrowUp,
  faArrowDown,
  faTired,
  faTurtle,
  faEllipsisHAlt,
  faArrowToBottom
} from '@fortawesome/pro-solid-svg-icons';
import {
  faSearch,
  faQuestionCircle,
  faUserCircle,
  faCalendarAlt,
  faFileCsv,
  faDownload,
  faCalendar as faCalendarLight,
  faUser,
  faCodeCommit,
  faCodeMerge,
  faCodeBranch,
  faStar
} from '@fortawesome/pro-light-svg-icons';
import {
  faEllipsisV,
  faAnalytics as faAnalyticsReg,
  faTachometerAltFastest as faTachometerAltFastestReg,
  faShieldCheck as faShieldCheckReg,
  faUserCheck as faUserCheckReg,
  faGlobe as faGlobeReg,
  faCode
} from '@fortawesome/pro-regular-svg-icons';

@NgModule({
  imports: [FontAwesomeModule],
  exports: [FontAwesomeModule]
})
export class IconsModule {
  public constructor(library: FaIconLibrary, config: FaConfig) {
    config.fixedWidth = true;

    library.addIcons(
      faAnalytics,
      faSearch,
      faTimesCircle,
      faEllipsisV,
      faCaretDown,
      faQuestionCircle,
      faUserCircle,
      faTachometerAltFastest,
      faShieldCheck,
      faUserCheck,
      faGlobe,
      faAnalyticsReg,
      faTachometerAltFastestReg,
      faShieldCheckReg,
      faUserCheckReg,
      faGlobeReg,
      faCalendar,
      faCalendarAlt,
      faCalendarLight,
      faFileCsv,
      faDownload,
      faUser,
      faChartLine,
      faChartLineDown,
      faCodeCommit,
      faCodeMerge,
      faCodeBranch,
      faStar,
      faCode,
      faArrowUp,
      faArrowDown,
      faTired,
      faTurtle,
      faEllipsisHAlt,
      faArrowToBottom
    );
  }
}
