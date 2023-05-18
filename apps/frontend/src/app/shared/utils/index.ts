// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

export function traceTime() {
  const start = new Date().getTime();

  return function end() {
    const endTime = new Date().getTime();
    const time = (endTime - start) / 1000;
    return time;
  };
}
