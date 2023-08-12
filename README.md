# Home Library Service
[Task description](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/rest-service/assignment.md)

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/NataliiaBoiko22/nodejs2023Q2-service.git
```
### Move to the app folder

```
cd nodejs2023Q2-service
```

### Switch to the necessary branch

```
git checkout docker-database-orm
```

## Installing NPM modules
```
npm install
```
## Running application
```
1. Before starting application run Docker Desktop  and  create `.env` file  using  `.env.example` as reference.
2. Build and start app:
```
npm run docker
```
You can see ` Server started at http://localhost:4000`
Then open new terminal.

3. To run all tests without authorization
```
npm run docker:test   or    npm run test
```

4. Vulnerability scanning for images: 
```
npm run docker:scan 
```
### Working with the application

You can work with the application using Postman and OpenAPI documentation by typing http://localhost:4000/doc/.

### Download images from repository on Docker Hub

docker pull nataliiaboiko/nodejs2023q2-service-app:latest
docker pull nataliiaboiko/nodejs2023q2-service-postgres:latest