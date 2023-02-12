# Common build stage
FROM node:18-alpine3.16

RUN apk add --update docker openrc
RUN rc-update add docker boot

COPY . ./app

WORKDIR app

RUN yarn install

EXPOSE 3000

ENV NODE_ENV production

CMD ["npm", "run", "start"]
