'use strict'

const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

const { APP_PATH, CONTROLLERS_PATH, STATIC_PATH } = require('../constants.js');
const { logger, asyncLocalStorage } = require('./lib/Logger');
const { log, start, end, getFunctionParams } = require('./helpers');

const controller = require('./controllers/Controller');
const db = require('./lib/DB');
const Files = require('./lib/Files');
const Route = require('./lib/route');
const Client = require('./lib/Client.js');
const model = require('./lib/Model');
const { secret } = require('./config.js');

log({ 'process.cwd': process.cwd() });

module.exports = {
    http,
    fs,
    path,
    db,
    controller,
    model,
    mime,
    secret,
    log,
    start,
    end,
    getFunctionParams,
    logger,
    Files,
    Route,
    Client,
    asyncLocalStorage,
    APP_PATH,
    CONTROLLERS_PATH,
    STATIC_PATH
};