# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download & Install Docker](https://docs.docker.com/engine/install/)

## Downloading

```
git clone {repository URL}
```

## Create .env File

Copy the example environment file. All values are already set:

```
cp .env.example .env
```

## Start the Application with Docker

MAKE SURE DOCKER IS RUNNING

In order to check image size of the image pull image from hub.docker.com:

```
docker pull besoberdzenishvili14/home-library-app
```

Then check the size with:

```
docker image
```

## Start the Application with Docker

To start all services:

```
docker-compose up --watch
```

This will build and run the application with all required services (e.g.: PostgreSQL).

App will run in a watch mode so any time change is made in src folder app will be reloaded. E.g. change "Hello World!" in app.service.ts and refresh the localhost:4000 page in browser to see the changes.

## Run Vulnerability Scan

After the Docker containers are up, run the vulnerability scan:

```
npm run scan:docker
```
