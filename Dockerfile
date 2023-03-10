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

ARG TARGET_ENV
ENV NODE_ENV=${TARGET_ENV}

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
EXPOSE 8080
CMD [ "npm", "run", "start:prod" ]