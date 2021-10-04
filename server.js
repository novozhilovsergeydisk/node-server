'use strict';

const route = require('./scripts/router');
const server = require('./scripts/http-server');

// console.log(route);

// console.log(/\/test\/\d*$/g.test("/test/12"));

const HOST_NAME = '127.0.0.1';
const PORT = 3000;

server.start(PORT, HOST_NAME, route);