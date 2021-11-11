const http = require('http');
const fs = require('fs');
const path = require('path');
const { APP_PATH, CONTROLLERS_PATH } = require('../constants.js');
const controller = require(CONTROLLERS_PATH + 'Controller');
const routes = require(APP_PATH + '/routes.json');
const { logger , asyncLocalStorage } = require(APP_PATH + '/utils/Logger');
const mime = require('mime');
const STATIC_PATH = path.join(process.cwd(), './static');

console.log({ 'process.cwd': process.cwd() });

const MIME_TYPES = {
    html: 'text/html; charset=UTF-8',
    js:   'application/javascript; charset=UTF-8',
    css:  'text/css',
    png:  'image/png',
    jpeg: 'image/jpeg',
    ico:  'image/x-icon',
    svg:  'image/svg+xml',
};

const serveFile = (client) => {
    const { req, name } = client;

    const filePath = path.join(STATIC_PATH, name);

    if (!filePath.startsWith(STATIC_PATH)) {
        console.log(`Can't be served: ${name}`);
        return null;
    }

    const promiseStream = new Promise((resolve, reject) => {
        fs.stat(filePath, (error, stats) => {
            if (error) {
                const error_stream = 'No resource file: ' + req.url;
                reject(error_stream);
            }
            else {
                const stream = fs.createReadStream(filePath);
                stream._stats = stats;
                console.log(`Served resource file and resolve promise: ${name}`);
                resolve(stream);
            }
        });
    });

    return promiseStream;
};

const user = { patient: 'Новожилов Сергей', age: 57 };

class Route {
    routing = {
        '/': 'welcome to transplant.net',
        '/user': user,
        '/contacts': 'contacts',
        '/user/patient': () => user.patient,
        '/user/age': () => user.age,
        '/user/*': (client, par) => 'parameter=' + par[0],
    };
    types = {
        object: JSON.stringify,
        string: s => s,
        number: n => n + '',
        undefined: () => 'not found',
        function: (fn, par, client) => fn(client, par),
    };
    matching = [];

    constructor(client) {
        this.client = client;
        for (const key in this.routing) {
            if (key.includes('*')) {
                const rx = new RegExp(key.replace('*', '(.*)'));
                const route = this.routing[key];
                this.matching.push([rx, route]);
                delete this.routing[key];
            }
        }
    }

    resolve() {
        console.log({ 'routing': this.routing });
        console.log({ 'matching': this.matching });
        let par;
        let route = this.routing[this.client.req.url];
        if (!route) {
            for (let i = 0; i < this.matching.length; i++) {
                const rx = this.matching[i];
                par = this.client.req.url.match(rx[0]);
                if (par) {
                    par.shift();
                    route = rx[1];
                    break;
                }
            }
        }
        const type = typeof route;
        const renderer = this.types[type];
        console.log({ 'type': type, 'renderer': renderer });
        console.log({ 'route': route, 'par': par });
        const result = renderer(route, par, this.client);
        console.log({ 'result': result })
        return result;
    }
}

class Server {
    constructor() {};

    render(client) {
        client.res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        client.res.end((new Route(client)).resolve());
    }

    createServer(port, host) {
        const server = http.createServer((req, res) => {
            let client = { req, res };

            if (req.method === 'GET') {
                const { url } = req;

                client.name = url;
                client.fileExt = path.extname(client.name).substring(1);
                client.mimeType = MIME_TYPES[client.fileExt] || MIME_TYPES.html;

                // client.name = url === '/' ? '/index.html' : url;
                // client.fileExt = path.extname(client.name).substring(1);
                // client.mimeType = MIME_TYPES[client.fileExt] || MIME_TYPES.html;

                this.render(client);

                this.statics(client);

                // if (!findRoute) {
                //     this.notFound(client);
                // } else {
                //     controller.call(client, findRoute.handler, findRoute.action, null);
                // }

                // return;
            }

            if (req.method === 'POST') {
                if (!findRoute) {
                    this.notFound(client);
                } else {
                    let body = '';

                    req.on('data', function(chunk) {
                        // console.log({ 'chunk': chunk });

                        body += chunk.toString();

                        controller.call(client, findRoute.handler, findRoute.action, body);

                    });

                    // console.log({ 'body out': body });

                    // ControllerMethodCall(res, findRoute.handler, findRoute.action, body);
                }
            }

            if (req.method === 'PUT') {
                mainController.success(res, 'put');
            }

            req.on('end', function() {
                // console.log('end');
            });
        });

        server.on('request', function(req, res) {
            // const client = { req, res };
            // console.log('On server request url: ' + req.url);
            // this.statics(client);
        });

        server.listen(port, host, () => {
            console.log(`Server running at http://${host}:${port}/`);
        });
    }

    start(port, host) {
        this.createServer(port, host);
    }

    statics(client) {
        const promiseStream = new Promise((resolve) => {
            resolve(serveFile(client));
        });
        promiseStream.then(stream => {
            client.res.writeHead(200, { 'Content-Type': client.mimeType });
            if (stream) stream.pipe(client.res);
            client.res.end();
            console.log({ 'stream': stream });
        }).catch(error_stream => {
            console.log(error_stream);

            // if (error.code == 'ENOENT') {
            //     console.log({ 'error statics()': error });
            //     this.notFound(client);
            // }
        });
    };


        // if (!findRoute) {
        //     this.notFound(client);
        // } else {
        //     controller.call(client, findRoute.handler, findRoute.action, null);
        // }


    notFound(client) {
        controller.call(client, 'main', 'notFound', null);
    }
}

module.exports = new Server();