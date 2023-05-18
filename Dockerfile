# Copyright The Linux Foundation and each contributor to LFX.
# SPDX-License-Identifier: MIT
FROM node:lts-gallium

ENV ENV=development
ENV PORT=8000
ENV API_HOST_URL=https://api-gw.dev.platform.linuxfoundation.org/
ENV AUTH0_AUDIENCE=https://api-gw.dev.platform.linuxfoundation.org/
ENV AUTH0_ISSUER=https://linuxfoundation-dev.auth0.com/

# ENV NODE_ENV=production
# WORKDIR /usr/src/app
# COPY ["package.json", "yarn.lock*", "npm-shrinkwrap.json*", "./"]
# RUN yarn install && mv node_modules ../
# COPY . .
# EXPOSE 8000
# RUN chown -R node /usr/src/app
# USER node
# # RUN npm i -g turbo
# CMD ["node", "apps/backend/dist/main"]

WORKDIR /app

COPY **/package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 8000

RUN rm -rf apps/frontend
RUN cd apps/backend
RUN yarn install
RUN yarn build

CMD [ "yarn", "start:server" ]`
