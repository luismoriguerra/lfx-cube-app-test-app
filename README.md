# LFX Insights UI + BFF

This repository houses the LFX Insights UI and BFF for Insights V3. (TODO: update this to include the project description)

Please see [definitions](./DEFINITIONS.md).

## Project Goals

ADD PROJECT GOALS HERE

## Architecture and Documentation

TODO: Insert image of architecture diagram here
For detailed architecture and documentation, please check out our [Wiki](https://github.com/LF-Engineering/lfx-insights-ui/wiki).

### Built With

- [Turbo Pack](https://github.com/vercel/turbo)
- [Angular](https://github.com/angular/angular)
- [Tailwind](https://github.com/tailwindlabs/tailwindcss)
- [Amcharts5](https://github.com/amcharts/amcharts5)
- [Fontawesome](https://fontawesome.com/docs/web/setup/packages)
- [Cube.js](https://github.com/cube-js/cube.js)
- [PostgreSQL](https://github.com/postgres/postgres)
- [Prisma.js](https://github.com/prisma/prisma)
- [Docker](https://docs.docker.com/)

### Documentation

- [Angular](https://github.com/LF-Engineering/lfx-insights-ui/tree/main/apps/frontend/readme.md)
- [Cube.js](https://github.com/LF-Engineering/lfx-insights-ui/tree/main/apps/cubejs)
- [Database](https://github.com/LF-Engineering/lfx-insights-ui/tree/main/apps/cubejs/database)

## Getting started

### Getting Sources

You need to clone the repo from here `https://github.com/LF-Engineering/lfx-insights-ui.git`.

```bash
$ git clone https://github.com/LF-Engineering/lfx-insights-ui.git
```

### Prerequisites

1. Make sure you have Node 16.19.0 or higher, together with NPM 6.x or higher.

2. Install `yarn` globally on your machine.

   ```bash
   $ npm install -g yarn
   ```

3. Install `angular-cli` globally. At least we want version 13+.

   ```bash
   $ npm install -g angular-cli
   ```

4. Install Docker

   ```bash
   brew install docker
   ```

Recommended IDE: [Visual Studio Code](https://code.visualstudio.com/)

### Installation

From the root of the repo just run:

```bash
$ yarn install
```

### Building

1. Run `yarn build` from the root folder to build the project for your local environment.
2. The build artifacts will be stored in the `dist/` in the applications respective directories.
3. Use `yarn build:<env>` to build for selected env and this is useful for CI builds.
   - `yarn build:dev` for development environment.
   - `yarn build:prod` for prod environment.

### Running

1. Run `yarn start`
   The command above will do the following:
   - Build and run the frontend SPA which will be available on [http://localhost:4200](http://localhost:4200)
   - Run Cube.js server which will be available on [http://localhost:4000](http://localhost:4000)

### Running Frontend Only

```
yarn frontend:dev
```

- Build and run the frontend SPA which will be available on [http://localhost:4200](http://localhost:4200)

### Running Frontend remotely

```
yarn frontend:remote
```

- Build and run the frontend SPA which will be available on [http://0.0.0.0:4200](http://0.0.0.0:4200) (will be visible to the outside world at http://your-ip:4200).

### Running Cubejs Only

```
yarn cube
```

- Run Cube.js server which will be available on [http://localhost:4000](http://localhost:4000)

### Branching and Deployment

The project is set up to auto-deploy a feature branch to its own environment. Once a branch with the following branching name structure `feature/feature-name` is pushed or updated. The GitHub actions will automatically deploy it in its own URL: <branch-name>.insights-fb.dev.platform.linuxfoundation.org. Once a deployment is complete, a comment will be posted in the pull request with the exact URL.

Dev URL: https://insights.dev.platform.linuxfoundation.org/

Cube Dev URL: https://lfx-dev.cubecloud.dev/deployments/20/playground

Prod URL: https://insights.v3.lfx.linuxfoundation.org/

### Setup Cubejs locally

1. Create file: apps/cubejs/.env
2. Credentials: https://linuxfoundation.1password.com/vaults/all/allitems/bo262ucfapve3ynop7ldygagdy

> apps/cubejs/.env file example

```
CUBEJS_DEV_MODE=true
CUBEJS_EXTERNAL_DEFAULT=true
CUBEJS_SCHEDULED_REFRESH_DEFAULT=true
CUBEJS_WEB_SOCKETS=true
CUBEJS_DATASOURCES=default,redshiftlfx
CUBEJS_API_SECRET=
CUBEJS_DB_HOST=amazonaws.com
CUBEJS_DB_PORT=
CUBEJS_DB_NAME=
CUBEJS_DB_USER=
CUBEJS_DB_PASS=
CUBEJS_DB_TYPE=
CUBEJS_DS_REDSHIFTLFX_DB_HOST=
CUBEJS_DS_REDSHIFTLFX_DB_PORT=
CUBEJS_DS_REDSHIFTLFX_DB_NAME=
CUBEJS_DS_REDSHIFTLFX_DB_USER=
CUBEJS_DS_REDSHIFTLFX_DB_PASS=
CUBEJS_DS_REDSHIFTLFX_DB_TYPE=
```

3. Run Cube.js server

```
yarn cube
```

Open http://localhost:4000/

### Linting

This project uses a strict set of ESLint rules and should be followed accordingly. If you are using Visual Studio Code as your IDE, there will be some recommended extensions and settings within this repository that will help with writing code and auto-fixing linting errors on save.

You should **not** disable linting within files unless absolutely necessary. Attempt to fix the issue to comply with the linting rules instead of disabling the rule.

When attempting to commit code, on each commit we run a lint test to ensure that the updated code follows the rules. Failure to do so will fail the commit.

### Runnig tests

This project uses Cypress for testing. You will need the environment variables stored inside the "apps/tests-e2e/e2e.env" file. Reach out to any of the devs to get these keys. To run tests in headless mode simple run (from the root directory):

```
yarn test
```

Alternatively, you can execute the test with the UI. Simply navigate to "apps/tests-e2e" and run:

```
cd apps/tests-e2e
source e2e.env
yarn test:open
```

If you have the Angular app instance already running you can instead run (from the "apps/tests-e2e" folder):

```
cd apps/tests-e2e
source e2e.env
yarn cypress:open
```

## Contributing

Please see [CONTRIBUTING.md](https://github.com/LF-Engineering/lfx-insights-ui/blob/main/CONTRIBUTING.md) for more details.

You can find some general information about how to work on this repo in the [architecture](https://github.com/LF-Engineering/lfx-insights-ui/wiki/Structure) and the [development environment setup documents](https://github.com/LF-Engineering/lfx-insights-ui/wiki/getting-started).

## Troubleshooting

(1) Port 4200 is already in use

```bash
npx kill-port 4200
```

(2) Cubejs docker can't start

> Bind for 0.0.0.0:4000 failed: port is already allocated.

```bash
docker rm -vf $(docker ps -aq)
```

(3) Error with Fontawesome Pro

> error An unexpected error occurred: "https://npm.fontawesome.com/@fortawesome/pro-solid-svg-icons/-/5.15.4/pro-solid-svg-icons-5.15.4.tgz: Request failed \"401 Unauthorized\"

```bash
npm config set "@fortawesome:registry" https://npm.fontawesome.com/
npm config set "//npm.fontawesome.com/:_authToken" {replace_token}
```

## License

This project’s source code is licensed under the MIT License. A copy of the license is available in [LICENSE](https://github.com/LF-Engineering/lfx-insights-ui/blob/main/LICENSE).

The project includes source code from keycloak, which is licensed under the Apache License, version 2.0 (Apache-2.0), a copy of which is available in LICENSE-keycloak.

This project’s documentation is licensed under the Creative Commons Attribution 4.0 International License (CC-BY-4.0). A copy of the license is available in LICENSE-docs.

---

Copyright The Linux Foundation and each contributor to LFX.
# lfx-cube-app-test-app
