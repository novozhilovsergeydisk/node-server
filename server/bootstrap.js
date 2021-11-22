'use strict'

const http = require('http');
const fs = require('fs');
const path = require('path');
const { APP_PATH, CONTROLLERS_PATH, STATIC_PATH } = require('../constants.js');
const controller = require(CONTROLLERS_PATH + 'Controller');
const routes = require(APP_PATH + '/routes.json');
const { logger, asyncLocalStorage } = require(APP_PATH + '/server/classes/Logger');
const db = require(APP_PATH + '/server/classes/DB');
// const db = require('./db.js');
const mime = require('mime');

// console.log({ 'process.cwd': process.cwd() });

module.exports = { http, fs, path, db, controller, routes, mime, logger, asyncLocalStorage, APP_PATH, CONTROLLERS_PATH, STATIC_PATH };