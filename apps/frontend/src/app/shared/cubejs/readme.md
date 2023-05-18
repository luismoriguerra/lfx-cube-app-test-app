### How to integrate Cube

**1) Add/Update Cube Definition**
eg apps/frontend/src/app/shared/cubejs/cubes/Contributors.ts

**2) Add/Update Cube Metrics (queries):**
eg apps/frontend/src/app/shared/cubejs/metrics/contributors/ContributorsSeries.ts

**3) Define ChartNames:**
eg packages/lfx-insights/interfaces/charts.d.ts

**4) Update Chart Service to fetch data**
eg apps/frontend/src/app/shared/services/chart.service.ts

**5) Add/Update UI with Chart config and chart component**
eg apps/frontend/src/app/modules/overview/components/summary-charts/summary-charts.component.ts

## Future work

1. Still looking for reducing the complexity to add new charts
2. Add a Playground-chart page to allow test new Cubes and queries (like playground in cube cloud by using amchart)
3. Update Chart components to allow export Chart Query for debugging (like ossinsights `<> sql` option)
4. Add alerts that a Chart isn't accelerated by pre-aggregations.
5. Move Cube to the package folder (following prisma example https://turbo.build/repo/docs/handbook/tools/prisma )
6. Move Cube Definitions to Package folder:
   so any Cube work must be decoupled of the project, and in that way would be easy to share to feature projects as npm module or mono repo dependency
