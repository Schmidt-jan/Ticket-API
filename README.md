# Node Template
This is a template for creating Web-API's with Typescript. Express and Swagger. Also the packages for unit testing are included. Therefore are [mocha](https://mochajs.org/) and [chai](https://www.chaijs.com/) used\
The swagger documentation is available at: http://localhost:4000/docs
The documentation is written with the yaml-based OpenApi-standard

## Installation
Clone the project ann install all required packages
```
git clone https://github.com/Schmidt-jan/Node_Template.git
cd Node_Template
npm install
```
Run the server and swagger documentation:
```
npm start
```
Run tests
```
npm test
```
##Start/ Stop mongoDb container
Start the docker container
```
docker-compose up
```
Shutdown the docker container
```
docker-compose down
```
To get into the docker container run
```
docker exec -it ticketApi_storage /bin/bash
```
