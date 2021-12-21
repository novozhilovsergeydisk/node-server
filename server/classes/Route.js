'use strict'

const { APP_PATH, CONTROLLERS_PATH } = require('../../constants.js');
const { asyncLocalStorage } = require(APP_PATH + '/server/classes/Logger');
// const Files = require(APP_PATH + '/server/classes/Files');
const { DTOFactory, log, capitalizeFirstLetter } = require('../helpers');
const controller = require(CONTROLLERS_PATH + 'Controller');
const { patientControllers, staticController } = require('../controllers/patients.js');

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
    constructor(client) {
        this.matching = [];

        this.types = {
            object: JSON.stringify,
            string: s => s,
            number: n => n + '',
            undefined: () => { return { status: '404 not found' } },
            function: (fn, par, client) => fn(client, par),
        };

        this.routing = {
            'GET': {
                '/': (client, par) => handler(client, 'main', 'index', par, {roles: ['user']}),
                '/index': patientControllers.getAllPatients,
                '/index/*': patientControllers.getAllPatients,
                '/patient/id/*': patientControllers.getPatient,
                '/api/activate/*': (client, par) => handler(client, 'main', 'activate', par, {roles: ['admin']}),
                '/api/refresh': (client, par) => handler(client, 'main', 'refresh', par, {roles: ['admin']}),
                '/*': staticController.staticContent,
                '/css/*': staticController.staticContent,
                '/js/*': staticController.staticContent,
                '/images/*': staticController.staticContent,
                '/register': patientControllers.register
            },
            'POST': {
                '/register': (client, par) => handler(client, 'main', 'registration', par, {roles: ['admin']}),
                '/login': (client, par) => handler(client, 'main', 'login', par, {roles: ['admin']}),
                '/logut': (client, par) => handler(client, 'main', 'logout', par, {roles: ['admin']})
            }
        };

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

    resolve() {
        let par;
        const name = this.client.name;
        const http_method = this.client.http_method;
        let route = this.routing[http_method][name];
        if (!route) {
            for (let i = 0; i < this.matching.length; i++) {
                par = null;
                const rx = this.matching[i];
                const url = this.client.name;
                par = url.match(rx[0]);
                if (par) {
                    const parArr = url.split('/');
                    if (parArr.length > 1) {
                        const name = parArr[parArr.length - 2];
                        const value = parArr[parArr.length - 1];
                        par = { name: name, value: value };
                    }
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
        this.par = par;
        const ret = this.renderer(this.route, this.par, this.client);
        return ret;
    };
}

module.exports = Route;

// 'use strict';

// var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
//
// var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
//
// function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
//
// var Route = function () {
//     function Route(client) {
//         _classCallCheck(this, Route);
//
//         this.matching = [];
//
//         this.types = {
//             object: JSON.stringify,
//             string: function string(s) {
//                 return s;
//             },
//             number: function number(n) {
//                 return n + '';
//             },
//             undefined: function undefined() {
//                 return { status: '404 not found' };
//             },
//             function: function _function(fn, par, client) {
//                 return fn(client, par);
//             }
//         };
//
//         this.routing = {
//             'GET': {
//                 '/': function _(client, par) {
//                     return handler(client, 'main', 'index', par, { roles: ['user'] });
//                 },
//                 '/index': patientControllers.getAllPatients,
//                 '/index/*': patientControllers.getAllPatients,
//                 '/patient/id/*': patientControllers.getPatient,
//                 '/api/activate/*': function apiActivate(client, par) {
//                     return handler(client, 'main', 'activate', par, { roles: ['admin'] });
//                 },
//                 '/api/refresh': function apiRefresh(client, par) {
//                     return handler(client, 'main', 'refresh', par, { roles: ['admin'] });
//                 },
//                 '/*': staticController.staticContent,
//                 '/css/*': staticController.staticContent,
//                 '/js/*': staticController.staticContent,
//                 '/images/*': staticController.staticContent,
//                 '/register': patientControllers.register
//             },
//             'POST': {
//                 '/register': function register(client, par) {
//                     return handler(client, 'main', 'registration', par, { roles: ['admin'] });
//                 },
//                 '/login': function login(client, par) {
//                     return handler(client, 'main', 'login', par, { roles: ['admin'] });
//                 },
//                 '/logut': function logut(client, par) {
//                     return handler(client, 'main', 'logout', par, { roles: ['admin'] });
//                 }
//             }
//         };
//
//         this.client = client;
//         for (var key in this.routing[client.http_method]) {
//             if (key.includes('*')) {
//                 var rx = new RegExp('^' + key.replace('*', '(.*)'));
//                 var route = this.routing[client.http_method][key];
//                 this.matching.push([rx, route]);
//                 delete this.routing[client.http_method][key];
//             }
//         }
//     }
//
//     _createClass(Route, [{
//         key: 'resolve',
//         value: function resolve() {
//             var par = void 0;
//             var name = this.client.name;
//             var http_method = this.client.http_method;
//             var route = this.routing[http_method][name];
//             if (!route) {
//                 for (var i = 0; i < this.matching.length; i++) {
//                     par = null;
//                     var rx = this.matching[i];
//                     var url = this.client.name;
//                     par = url.match(rx[0]);
//                     if (par) {
//                         var parArr = url.split('/');
//                         if (parArr.length > 1) {
//                             var _name = parArr[parArr.length - 2];
//                             var value = parArr[parArr.length - 1];
//                             par = { name: _name, value: value };
//                         }
//                         route = rx[1];
//                         break;
//                     }
//                 }
//             }
//             var type = typeof route === 'undefined' ? 'undefined' : _typeof(route);
//             var renderer = this.types[type];
//             if (this.client.mimeType === 'text/html; charset=UTF-8') {
//                 var arr = this.client.name.split('/');
//                 this.client.controller = arr[1] ? arr[1] : 'main';
//                 this.client.method = arr[2] ? arr[2] : 'index';
//             }
//             this.route = route;
//             this.renderer = renderer;
//             this.par = par;
//             var ret = this.renderer(this.route, this.par, this.client);
//             return ret;
//         }
//     }]);
//
//     return Route;
// }();



// const routes = [
//     {
//         method: 'GET',
//         url: '/api/patients',
//         handler: patientController.getAllPatients
//     },
//     {
//         method: 'GET',
//         url: '/api/patients/:id',
//         handler: patientController.getPatient
//     },
//     {
//         method: 'POST',
//         url: '/api/patients',
//         handler: patientController.addPatient
//     },
//     {
//         method: 'PUT',
//         url: '/api/patients/:id',
//         handler: patientController.updatePatient
//     },
//     {
//         method: 'DELETE',
//         url: '/api/patients/:id',
//         handler: patientController.deletePatient
//     }
// ];