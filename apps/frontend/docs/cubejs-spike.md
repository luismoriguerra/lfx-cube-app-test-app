### Demo example

https://angular-dashboard-demo.cube.dev/#/table

### Code

https://github.com/cube-js/cube.js/tree/master/examples/angular-dashboard-with-material-ui

## Cubejs core issues with typescript versions but fixable

https://github.com/cube-js/cube.js/issues/5446
https://github.com/cube-js/cube.js/pull/5656
https://github.com/cube-js/cube.js/pull/3118
https://github.com/cube-js/cube.js/blob/master/DEPRECATION.md

### How to use it

https://cube.dev/docs/@cubejs-client-ngx

```ts
this.cubejs.watch(this.query).subscribe(
  (resultSet) => {
    console.log(resultSet.chartPivot()[0].x);
    console.log(resultSet.seriesNames()[0]);
    const cpivot = resultSet.chartPivot();
    const pivot = resultSet.pivot();
    const series = resultSet.series();
    const categories = resultSet.categories();
    const tableColumns = resultSet.tableColumns();
    console.log('> type of data', {
      resultSet,
      cpivot,
      pivot,
      series,
      categories,
      tableColumns
    });
  },
  (err) => console.log('HTTP Error', err)
);
```

we can find more options here , Examples aren't up to date (https://github.com/cube-js/cube.js/pull/3118)
https://github.com/cube-js/cube.js/blob/master/packages/cubejs-client-core/src/ResultSet.js#L461
