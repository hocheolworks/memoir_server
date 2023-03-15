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

## DATABASE
ARG DB_HOST
ARG DB_PORT
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_NAME
ARG DB_LOGGING
ARG DB_SCHEMA_NAME
ARG DB_SSL

## GITHUB
ARG GITHUB_CLIENT_SECRET
ARG GITHUB_CLIENT_ID

ENV DB_HOST=${DB_HOST} DB_PORT=${DB_PORT} DB_USERNAME=${DB_USERNAME} DB_PASSWORD=${DB_PASSWORD} DB_NAME=${DB_NAME} DB_LOGGING=${DB_LOGGING} DB_SCHEMA_NAME=${DB_SCHEMA_NAME} DB_SSL=${DB_SSL}
ENV GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET} GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]