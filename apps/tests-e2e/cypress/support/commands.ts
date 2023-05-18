// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import "@percy/cypress";

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

export {};
declare global {
  namespace Cypress {
    interface Chainable {
      percyResponsiveSnapshot(
        name: string,
        options?: any
      ): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add(
  "percyResponsiveSnapshot",
  (name: string, options: any = {}) => {
    delete options.widths; // we never want to use those in this helper

    cy.viewport("macbook-15").percySnapshot(name, {
      widths: [1440],
      ...options,
    });
    // Set back the orignal width if you'd like
    //.viewport()
  }
);
