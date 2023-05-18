### How to create new module

```bash
ng g m modules/playground --route=playground --routing=true --project=lfx-insights --module app.module
```

### How to create new component

```bash
ng g c modules/playground/components/cubejs-chart-example
```

### Review Component examples

Go to http://localhost:4200/playground

### Troubleshoot

**(1) Frontend can't connect to Cubejs API**
(1) Open http://localhost:4000/
(2) run a simple Chart and review chart code and look for cubejsAPI and copy the token value
(3) Go to apps/frontend/src/environments/environment.ts
(4) Update Cubejs Token.

![image](https://user-images.githubusercontent.com/3759580/224181093-0661d98f-378c-42f2-8589-cd8ed77175fe.png)

## Notes

Now you are ready to
(1) Create a mock database table using prismaJs
(2) Create/Update Cubejs schemas, dimensions, measures, and pre-aggregations
(3) Create Cubejs JSON Queries to use in the frontend app

- for examples,see
  > apps/frontend/src/app/services/project.service.ts
  > apps/frontend/src/app/modules/playground/components/project-list/project-list.component.ts
