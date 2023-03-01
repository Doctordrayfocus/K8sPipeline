# We need an nginx container which can pass requests to our nodejs container,
# as well as serve any static content.
FROM hoosin/alpine-nginx-nodejs:latest

# install git
RUN apk add --no-cache git

# install curl
RUN apk add --no-cache curl

# install docker
RUN apk add docker

RUN wget https://github.com/earthly/earthly/releases/download/v0.6.30/earthly-linux-amd64 -O /usr/local/bin/earthly && \
  chmod +x /usr/local/bin/earthly && \
  /usr/local/bin/earthly bootstrap


RUN apk add --update nodejs npm

# install node typescript
RUN npm install -g ts-node

# Create app directory
WORKDIR /usr/src/app

## Then copy our app source code into the image
COPY  . .

## Build Client
RUN cd /usr/src/app/frontend && npm install && npm run build

## Build server
RUN cd /usr/src/app && npm install && npm run build


EXPOSE 8080
CMD [ "npm", "run", "prod"]

# We need to add our NGINX template to the container for startup,
# and configuration.
COPY ./docker-config/nginx.conf /etc/nginx/templates/default.conf.template
