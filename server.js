'use strict';

const server = require('./scripts/http-server');
const route = require('./scripts/router');

const HOST_NAME = '127.0.0.1';
const PORT = 3000;

server.start(PORT, HOST_NAME, route);