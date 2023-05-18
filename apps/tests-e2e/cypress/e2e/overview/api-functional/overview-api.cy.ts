// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { overviewAPIList } from "../../../fixtures/overview-api-list";
import { hasProperty } from "../../../utils/cubejs-test-utils";
import { ApiIdentity } from "../../../utils/interface";

const endpoint = Cypress.env("API_DEV");

const apiList: ApiIdentity[] = overviewAPIList.map((o) => o);

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
          break;
        }
      }
    });
  });

  it("should test all the API calls", () => {
    cy.visit("/k8s/overview");

    apiList.forEach((apiIdent) => {
      cy.wait(`@${apiIdent.name}`).then((res) => {
        // Testing that all the APIs return 200 status
        expect(res.response.statusCode).to.eq(200);
      });
    });
  });
});
