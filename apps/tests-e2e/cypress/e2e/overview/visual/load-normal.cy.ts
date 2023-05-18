// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { overviewAPIList } from "../../../fixtures/overview-api-list";
import { hasProperty } from "../../../utils/cubejs-test-utils";
import { doScreenshot } from "../../../utils/helpers";
import { ApiIdentity } from "../../../utils/interface";

const endpoint = Cypress.env("API_DEV");

const apiList: ApiIdentity[] = overviewAPIList.map((o) => o);
let chartsLoaded = 0;

describe("Overview page", () => {
  beforeEach(() => {
    cy.intercept("GET", `${endpoint}?*`, (req) => {
      // loop through the apiList and find a matching query signature
      for (let i = 0; i < apiList.length; i++) {
        const apiIdent = apiList[i];
        let allPropsChecked = true;
        apiIdent.properties.forEach((p) => {
          if (!hasProperty(req, p.propertyName, p.value)) {
            allPropsChecked = false;
          }
        });

        if (allPropsChecked && !apiList[i].isIntercepted) {
          req.alias = apiIdent.name;

          apiList[i].isIntercepted = true;

          // adding mock data so that the chart would render the same thing every test run
          req.reply({
            statusCode: 200,
            fixture: `overview/mock/${apiIdent.name}.json`,
          });
          break;
        }
      }
    });
  });

  it("should load the page without errors", () => {
    cy.visit("/k8s/overview");

    apiList.forEach((apiIdent) => {
      cy.wait(`@${apiIdent.name}`).then(() => {
        chartsLoaded++;

        // Calling the Percy take snapshot function
        doScreenshot("Overview Page", chartsLoaded, apiList.length);
      });
    });

    // this is a sample test to see if the overview title text is visible on the page
    cy.get(".section-top")
      .should("be.visible")
      .should("contain.text", "Overview");
  });
});
