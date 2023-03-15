# Base image
FROM node:lts-alpine

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

## ENV Set
ARG NODE_ENV

## DATABASE
ARG DB_HOST
ARG DB_PORT
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_NAME
ARG DB_LOGGING
ARG DB_SCHEMA_NAME
ARG DB_SSL

## GITAPI
ARG GITAPI_CLIENT_SECRET
ARG GITAPI_CLIENT_ID

ENV NODE_ENV=production
ENV DB_HOST=${DB_HOST} DB_PORT=${DB_PORT} DB_USERNAME=${DB_USERNAME} DB_PASSWORD=${DB_PASSWORD} DB_NAME=${DB_NAME} DB_LOGGING=${DB_LOGGING} DB_SCHEMA_NAME=${DB_SCHEMA_NAME} DB_SSL=${DB_SSL}
ENV GITAPI_CLIENT_SECRET=${GITAPI_CLIENT_SECRET} GITAPI_CLIENT_ID=${GITAPI_CLIENT_ID}

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]