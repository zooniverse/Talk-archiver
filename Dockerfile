FROM node:13

RUN mkdir -p /app
WORKDIR /app/

ENV NODE_ENV production

ADD package.json .
ADD yarn.lock .

RUN yarn install

ADD . /app

CMD ["yarn dev"]