FROM node:13

RUN mkdir -p /app
WORKDIR /app/

ENV NODE_ENV production

RUN chown -R node:node /app
USER node

ADD package.json .
ADD yarn.lock .

RUN yarn install

ADD . /app

CMD ["yarn dev"]