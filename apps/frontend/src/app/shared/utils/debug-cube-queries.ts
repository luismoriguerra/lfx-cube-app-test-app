// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

/* eslint-disable no-restricted-syntax */

const DEBUG = window.localStorage.getItem('DEBUG') === '1';
const DEBUG_FILTER = window.localStorage.getItem('DEBUG_FILTER') || '';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.setDebugFilter = (filter: string) => {
  window.localStorage.setItem('DEBUG', '1');
  window.localStorage.setItem('DEBUG_FILTER', filter);
  window.location.reload();
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.clearDebug = () => {
  window.localStorage.removeItem('DEBUG_FILTER');
  window.localStorage.removeItem('DEBUG');
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.toggleDebug = () => {
  window.localStorage.setItem('DEBUG', DEBUG ? '0' : '1');
  window.location.reload();
};

export function logCubeQueries(playgroundUrl: string, time: number, resultSet: any = null) {
  if (!DEBUG) {
    return;
  }

  if (!!DEBUG_FILTER && !playgroundUrl.toLowerCase().includes(DEBUG_FILTER.toLowerCase())) {
    return;
  }
  const url = decodeURIComponent(playgroundUrl);
  const query = url.split('?query=')[1];
  let measures: any = {};
  try {
    measures = JSON.parse(query).measures;
  } catch (error) {
    console.log('Error parsing JSON', error);
    return;
  }

  if (time > 3) {
    console.log(`%c` + '> CUBE query' + JSON.stringify({ playgroundUrl, time, measures }, null, 2), 'color: red');
    console.log('> resultSet', resultSet);
    return;
  } else if (time > 2) {
    console.log(`%c` + '> CUBE query' + JSON.stringify({ playgroundUrl, time, measures }, null, 2), 'color: orange');
    console.log('> resultSet', resultSet);
    return;
  }
}
