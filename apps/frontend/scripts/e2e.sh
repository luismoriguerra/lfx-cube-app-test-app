# Copyright The Linux Foundation and each contributor to LFX.
# SPDX-License-Identifier: MIT
#!/usr/bin/env bash

while getopts ":m:" opts; do
  case ${opts} in
    m) MODE=${OPTARG} ;;
  esac
done

FILE="${PWD}/cypress/e2e.env"

if [ -f "$FILE" ]; then
  echo "sourcing env file"
  source $FILE
fi

# Kill local server if running
lsof -t -i tcp:4200 | xargs kill

## Get ng server id process id

$(yarn bin)/ng serve --configuration=e2e --no-progress 2> /dev/null &

echo "Waiting for server on http://localhost:4200"

while ! curl -s --progress-bar http://localhost:4200 > /dev/null; do
  sleep 1
  /bin/echo -n "."
done

echo "========================= Angular Server Started At http://localhost:4200 ==============================="

## Get ng server id process id
DEV_SERVER_PID=$(lsof -t -i :4200)

# function for killing ng server
ctrl_c () {
  echo "***Killing server***"
  lsof -t -i tcp:4200 | xargs kill

  exit 0
}

# Kill Dev server on control c
trap ctrl_c INT
# Start in headless mode
if [ "${MODE}" == 'h' ]; then
  echo "========================================= Running Cypress ========================================="

  $(yarn bin)/cypress run --browser chrome --config-file=cypress.config.ts --headless --env grepTags=@smoke && lsof -t -i tcp:4200 | xargs kill && exit
fi
