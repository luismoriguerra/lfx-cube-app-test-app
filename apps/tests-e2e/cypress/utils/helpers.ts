// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

export const capitalizeFirstLetter = (s: string): string =>
  s.charAt(0).toUpperCase() + s.substring(1);

export const lowerFirstLetter = (s: string): string =>
  s.charAt(0).toLowerCase() + s.substring(1);

export const doScreenshot = (
  name: string,
  loadCount: number,
  totalCount: number
): void => {
  if (loadCount === totalCount) {
    // adding a bit of a wait time for the chart to finish rendering

    cy.wait(1000);
    cy.log("TAKING A SNAPSHOT OF THE PAGE");
    cy.percyResponsiveSnapshot(name);
  }
};
