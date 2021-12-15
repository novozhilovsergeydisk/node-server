'use strict'

const { APP_PATH, CONTROLLERS_PATH } = require('../../constants.js');
const { asyncLocalStorage } = require(APP_PATH + '/server/classes/Logger');
const Files = require(APP_PATH + '/server/classes/Files');
const { DTOFactory, log, getFunctionParams, capitalizeFirstLetter } = require('../helpers');
const controller = require(CONTROLLERS_PATH + 'Controller');

const user = { patient: 'Новожилов Сергей', age: 57 };

const handler = (client, controllerName='main', action='index', data=null, roles=null) => {
    action = (client.action) ? client.action : action;
    const handlerPromise = new Promise((resolve) => {
        resolve(controller.call(client, controllerName, action, data));
    });
    return handlerPromise.then(data => {
        const entries = DTOFactory({
            info: 'Call controller ' + capitalizeFirstLetter(controllerName),
            status: 'success',
            stream: data,
        });
        return new Promise(resolve => {
            resolve(entries);
        });
    }).catch(err => {
        const entries = DTOFactory({
            info: 'Call controller ' + capitalizeFirstLetter(controllerName),
            status: 'failed',
            error: err,
            stream: null,
        });
        return new Promise(reject => {
            reject(entries);
        });
    });
};


class Route {
    routing = {
        'GET': {
            '/': (client, par) => handler(client, 'main', 'index', par, {roles: ['user']}),
            '/index': (client, par) => handler(client, 'main', 'index', par, {roles: ['user', 'admin']}),
            '/contacts': (client, par) => handler(client, 'main', 'contacts', par, {roles: ['user', 'admin']}),
            '/index/*': (client, par) => handler(client, 'main', 'index', par, { roles: ['user', 'admin'] }),
            '/api/activate/*': (client, par) => handler(client, 'main', 'activate', par, {roles: ['admin']}),
            '/api/refresh': (client, par) => handler(client, 'main', 'refresh', par, {roles: ['admin']}),
            '/users': (client, par) => handler(client, 'main', 'users', par, {roles: ['admin']}),
            '/user/patient': () => user.patient,
            '/user/doctor': (client, par) => 'parameter=' + par[0],
            '/*': (client, par) => this.statics(client, par),
            '/registration': (client, par) => handler(client, 'main', 'registration', par, {roles: ['user']})
        },
        'POST': {
            '/registration': (client, par) => handler(client, 'main', 'registration', par, {roles: ['admin']}),
            '/login': (client, par) => handler(client, 'main', 'login', par, {roles: ['admin']}),
            '/logut': (client, par) => handler(client, 'main', 'logout', par, {roles: ['admin']})
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
                const rx = new RegExp('^' + key.replace('*', '(.*)'));
                const route = this.routing[client.http_method][key];
                this.matching.push([rx, route]);
                delete this.routing[client.http_method][key];
            }
        }
    };

    statics(client) {
        const prom = new Promise((resolve) => resolve(new Files().serve(client)));
        return prom.then(stream => {
            return stream;
        }).catch(error_stream => {
            console.log({ 'Error stream': error_stream });
            return null;
        });
    };

    resolve() {
        let par;
        let route = this.routing[this.client.http_method][this.client.name];
        const resolveObj = {};
        if (!route) {
            for (let i = 0; i < this.matching.length; i++) {
                const rx = this.matching[i];
                par = this.client.name.match(rx[0]);
                if (par) {
                    par.shift();
                    route = rx[1];
                    break;
                }
            }
        }
        const type = typeof route;
        const renderer = this.types[type];
        if (this.client.mimeType === 'text/html; charset=UTF-8') {
            const arr = this.client.name.split('/');
            this.client.controller = arr[1] ? arr[1] : 'main';
            this.client.method = arr[2] ? arr[2] : 'index';
        }

        this.route = route;
        this.renderer = renderer;
        // this.intraspectionRenderer = getFunctionParams(renderer);
        this.par = par;

        // log(this);

        return this;
    };
}

module.exports = Route;