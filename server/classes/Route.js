'use strict'

const { APP_PATH, CONTROLLERS_PATH } = require('../../constants.js');
const { asyncLocalStorage } = require(APP_PATH + '/server/classes/Logger');
const Files = require(APP_PATH + '/server/classes/Files');
const { log, getFunctionParams } = require('../helpers');
const controller = require(CONTROLLERS_PATH + 'Controller');

const user = { patient: 'Новожилов Сергей', age: 57 };

class Route {
    routing = {
        'GET': {
            '/': (client, par) => this.handler(client, 'main', 'index', par, {roles: ['user']}),
            '/index': (client, par) => this.handler(client, 'main', 'index', par, {roles: ['user', 'admin']}),
            '/index/*': (client, par) => this.handler(client, 'main', 'index', par, { roles: ['user', 'admin'] }),
            '/api/activate/*': (client, par) => this.handler(client, 'main', 'activate', par, {roles: ['admin']}),
            '/api/refresh': (client, par) => this.handler(client, 'main', 'refresh', par, {roles: ['admin']}),
            '/users': (client, par) => this.handler(client, 'main', 'users', par, {roles: ['admin']}),
            '/user/patient': () => user.patient,
            '/user/age': () => user.age,
            '/user/*': (client, par) => 'parameter=' + par[0],
            '/*': (client, par) => this.statics(client, par)
        },
        'POST': {
            '/registration': (client, par) => this.handler(client, 'main', 'registration', par, {roles: ['admin']}),
            '/login': (client, par) => this.handler(client, 'main', 'login', par, {roles: ['admin']}),
            '/logut': (client, par) => this.handler(client, 'main', 'logout', par, {roles: ['admin']})
        }
    };

    types = {
        object: JSON.stringify,
        string: s => s,
        number: n => n + '',
        undefined: () => { return { status: '404 not found' } },
        function: (fn, par, client) => fn(client, par),
    };

    matching = [];

    constructor(client) {
        this.client = client;
        for (const key in this.routing[client.http_method]) {
            if (key.includes('*')) {

                // log({ 'key.replace()': '^' + key.replace('*', '(.*)') });

                const rx = new RegExp('^' + key.replace('*', '(.*)'));
                const route = this.routing[client.http_method][key];
                this.matching.push([rx, route]);
                delete this.routing[client.http_method][key];
            }
        }
    };

    handler(client, controllerName='main', action='index', data=null, roles=null) {
        // log({ 'controllerName': controllerName, 'action': action, 'data': data, 'roles': roles });

        // controllerName = (client.controller) ? client.controller : controllerName;
        action = (client.action) ? client.action : action;

        const prom = new Promise((resolve) => {
            // log({ 'controllerName Promise((resolve)': controllerName, 'action 2': action });

            // log({ 're': controller.call(client, controllerName, action, data) });

            resolve(controller.call(client, controllerName, action, data));
        });

        // log({ 're': controller.call(client, controllerName, action, data) });

        return prom.then(data => {
            return new Promise(resolve => {
                const entries = {
                    state: 'call controller',
                    info: 'controller' + controllerName,
                    status: 'success',
                    error: '',
                    stream: data
                };

                // log({ 'entries': entries });

                resolve(entries);
            });
        }).catch(err => {
            return new Promise(reject => {
                const entries = {
                    state: 'call controller',
                    info: 'controller' + controllerName,
                    status: 'failed',
                    error: err,
                    stream: null
                };
                reject(entries);
            });
        });
    };

    statics(client) {
        // log(client);

        const prom = new Promise((resolve) => resolve(new Files().serve(client)));
        return prom.then(stream => {
            // log({ 'stream.status': stream.status });

            // if (stream.status === 'failed') {
            //     // stream.stream = this.callController(client, 'main', 'notFound');
            // }

            return stream;
        }).catch(error_stream => {
            console.log({ 'Error stream': error_stream });
            return null;
        });
    };

    resolve() {
        // log({ 'this.matching': this.matching });

        log({ 'this.client': this.client });

        let par;
        let route = this.routing[this.client.http_method][this.client.name];

        log({ 'this.client.http_method': this.client.http_method });
        log({ 'this.client.name': this.client.name });
        log({ 'route': route });

        const renderObj = {};
        if (!route) {
            for (let i = 0; i < this.matching.length; i++) {
                const rx = this.matching[i];
                par = this.client.name.match(rx[0]);
                // log({ 'this.client.req.url': this.client.req.url, 'rx[0]': rx[0], 'par': par });
                if (par) {
                    par.shift();
                    route = rx[1];
                    break;
                }
            }
        }
        // log({ 'route': route });
        const type = typeof route;
        const renderer = this.types[type];
        if (this.client.mimeType === 'text/html; charset=UTF-8') {
            const arr = this.client.name.split('/');
            this.client.controller = arr[1] ? arr[1] : 'main';
            this.client.method = arr[2] ? arr[2] : 'index';
        }
        renderObj.client = this.client;

        renderObj.route = route;
        renderObj.renderer = renderer;
        // log({ 'renderer': renderer });
        renderObj.intraspectionRendererParams = getFunctionParams(renderer);
        renderObj.par = par;
        // log(renderObj.renderer);
        return renderObj;
    };
}

module.exports = Route;