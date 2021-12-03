'use strict'

const http = require('http');
const fs = require('fs');
const path = require('path');
const { APP_PATH, CONTROLLERS_PATH, STATIC_PATH } = require('../constants.js');
const controller = require(CONTROLLERS_PATH + 'Controller');
const routes = require(APP_PATH + '/routes.json');
const { logger, asyncLocalStorage } = require(APP_PATH + '/server/classes/Logger');
const db = require(APP_PATH + '/server/classes/DB');
const { log, getFunctionParams } = require('./helpers');
const mime = require('mime');
const Files = require(APP_PATH + '/server/classes/Files');
const Route = require(APP_PATH + '/server/classes/Route');

log({ 'process.cwd': process.cwd() });

module.exports = { http, fs, path, db, controller, routes, mime, log, getFunctionParams, logger, Files, Route, asyncLocalStorage, APP_PATH, CONTROLLERS_PATH, STATIC_PATH };