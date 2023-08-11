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

Before starting app create `.env` file  using  `.env.example` as reference.
```
npm start
```
You can see ` Server started at http://localhost:4000`
Then open new terminal.

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.

## Testing

To run all tests without authorization
```
npm run test
```

To run only one of all test suites
```
npm run test -- <path to suite>
```
### Auto-fix and format
```
npm run lint
```
```
npm run format
```

### Running application with Docker

1. Before starting application run Docker Desktop
2. Build and start app
```
npm run docker
```
You can see ` Server started at http://localhost:4000`
Then open new terminal.

3. To run all tests without authorization
```
npm run docker:test
```

4. Vulnerability scanning for images: 
```
npm run docker:scan 
```
### Working with the application

You can work with the application using Postman and OpenAPI documentation by typing http://localhost:4000/doc/.

