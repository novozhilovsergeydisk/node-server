'use strict'

const { SERVER_PATH } = require('../../constants.js');

const { asyncLocalStorage } = require(SERVER_PATH + '/lib/Logger');
const { DTOFactory, capitalizeFirstLetter, log } = require(SERVER_PATH + '/helpers');
const { controller } = require(SERVER_PATH + '/controllers/Controller.js');
const { patientController, staticController } = require('../controllers/patients.js');
const cabinetControllers = require('../controllers/cabinet.js');
const { Auth } = require(SERVER_PATH + '/lib/auth.js');

// const user = { patient: 'Новожилов Сергей', age: 57 };

const auth = new Auth();

// log( typeof cabinetControllers );

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
                '/': patientController.main,
                '/index': patientController.getAllPatients,
                '/index/*': patientController.getAllPatients,
                '/patient/id/*': patientController.getPatient,
                '/api/activate/*': auth.activate,
                '/api/refresh': auth.refresh,
                '/api/cabinet/id/*': cabinetControllers.cabinet,
                '/css/*': staticController.staticContent,
                '/js/*': staticController.staticContent,
                '/images/*': staticController.staticContent,
                '/register': patientController.register,
                '/favicon.ico': staticController.staticContent
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
    }

    test() {
        log('test');
    }

    resolve() {
        let par;
        // let url = this.client.url;
        const http_method = this.client.http_method;
        let route = this.routing[http_method][this.client.url];

        // log( this.client );

        if (!route) {
            for (let i = 0; i < this.matching.length; i++) {
                par = null;
                const rx = this.matching[i];
                const url = this.client.url;
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
            const arr = this.client.url.split('/');
            this.client.controller = arr[1] ? arr[1] : 'main';
            this.client.method = arr[2] ? arr[2] : 'index';
        }
        this.route = route;
        this.renderer = renderer;
        this.client.par = par;
        this.par = par;

        // log(this);

        // log({ route });

        // log({ renderer });

        // log(this.par);

        const ret = this.renderer(this.route, this.par, this.client);

        // log({ ret });

        return ret;
    }
}

module.exports = Route;


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