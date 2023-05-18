// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  export interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     *
     * @example cy.dataCy('greeting')
     */
    dataCy(value: string): Chainable<Element>;
    login(): Chainable<Element>;
    disableCache(): Chainable<Element>;
    createProject(accessToken: string, forceReuseLastRandomProject: boolean): Promise<any>;
    getIframe(iframe: string): Chainable<Element>;
  }
}
