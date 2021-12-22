'use strict';

const server = require('./server/http-server');
const HOST_NAME = '127.0.0.1';
const PORT = 3000;

server.start(PORT, HOST_NAME);