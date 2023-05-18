// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

// Import commands.js using ES2015 syntax:
import './commands';

// ***********************************************************
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
// cypress/support/index.ts
Cypress.Commands.add('dataCy', (value) => cy.get(`[data-cy=${value}]`));
