// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

// Utility to match CubeJS queries. Since we can't distinguish which query call is for which graph, we'll have to rely for now on the
// Measure value or the other parameters passed
export const hasProperty = (
  req: any,
  propertyName: string,
  value: string | string[]
): boolean => {
  const { url } = req;
  const urlParams = new URLSearchParams(url.split("?")[1]);
  const queryObj = JSON.parse(urlParams.get("query"));

  if (!queryObj.hasOwnProperty(propertyName)) {
    return false;
  }

  if (Array.isArray(value)) {
    return queryObj[propertyName] === value;
  }

  return queryObj[propertyName].indexOf(value) >= 0;
};
