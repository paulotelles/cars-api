# Cars API
## _Cognigy Challenge_

[![N|Solid](https://cldup.com/dTxpPi9lDf.thumb.png)](https://nodesource.com/products/nsolid)


This is a part of Cognigy, the objective is to build an API to create, delete, update and get Cars.

## Requirements

Use:
- modern Node.JS (node 12), ES7 / ES8 :heavy_check_mark:
- use a linter :heavy_check_mark:
- use the mongoose package from NPM :heavy_check_mark:
- use the express package from NPM :heavy_check_mark:
- use the ajv package from NPM :heavy_check_mark:
- containerize the solution :heavy_check_mark:

## Deliverables

Build a Node.JS based which uses the Express.JS framework to expose a RESTful API
to manage cars. Must have an endpoint for each functionality: 
- Create a new car. :heavy_check_mark:
- Read meta-data of all cars in the system. This endpoint should really only return
meta-data - there is no pagination required. :heavy_check_mark:
- Read the full data of an individual car. :heavy_check_mark:
- Delete an individual car. :heavy_check_mark:
- Updaten single properties of a single car. :heavy_check_mark:

Bonus task:
- Use Typescript for your whole application and add a simple x-api-key
based authentication mechanism to your application :heavy_check_mark:
 


## Tech

Main Technologies:

- [NestJS](https://nestjs.com/) - A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- [NodeJS](https://nodejs.org/en/) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
- [Typescript](https://www.typescriptlang.org/) - TypeScript is JavaScript with syntax for types.
- [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js.
- [Mongoose](https://mongoosejs.com/) - Elegant MongoDB object modeling for Node.js
- [Docker](https://www.docker.com/) - Build safer, share wider, run faster: 
- [Github Actions](https://github.com/features/actions) - Automate your workflow from idea to production
- [Jest](https://jestjs.io/) - Jest is a delightful JavaScript Testing Framework with a focus on simplicity.



## Installation


Clone this github repository

```bash
$ npm install
```

First of all, create .env file in the main folder and add mongodb URI and de x-api-key as in the .env-example.

## Running the app in the container

```bash
# run the application and mongodatabase
$ sudo docker-compose up
```

```bash
# stop the application and mongo database
$ sudo docker-compose down
```
## Running the app localy

Install NestJs globally
```bash
$ npm install -g @nestjs/cliBasic
``` 

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Extra 
- CI/CD: It is possible to make the CI/CD trough the pipelines configurations and utilization of Github Actions. All codes pushed to main will be deployed in Heroku if all the validations were completed.


## Next steps
- Metrics and traceability: Implement Datadog.
- Scalability: There is just one container non scalable, for a real production it would be necessary improve this point using Kubernetes for automating deployment, scaling, and management of containerized applications
- Security: It would be wise to implement some securities approaches, but for testing propose it was not possible.


