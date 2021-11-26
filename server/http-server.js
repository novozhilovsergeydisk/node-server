'use strict'

const { http, fs, path, log, controller, STATIC_PATH, getFunctionParams } = require('./bootstrap.js');

const MIME_TYPES = {
    html: 'text/html; charset=UTF-8',
    js:   'application/javascript; charset=UTF-8',
    css:  'text/css',
    png:  'image/png',
    jpeg: 'image/jpeg',
    ico:  'image/x-icon',
    svg:  'image/svg+xml',
};

const user = { patient: 'Новожилов Сергей', age: 57 };

class Files {
    serve(client) {
        const { name } = client;
        const filePath = path.join(STATIC_PATH, name);

        return Promise.resolve()
            .then(() => {
                return this.exists(filePath)
            })
            .then(result => {
                if (result.status === 'success') {
                    client.file = filePath;
                    result.stream = this.stream(client);
                }

                if (result.status === 'failed') {
                    result.stream = null;
                    return result;
                }

                // log({ 'result': result });

                return result;
            })
            .catch(err => {
                console.log({ 'Error while streaming process': err });
            });
    };

    stream(client) {
        const { file, name } = client;
        // log({ ' stream(file)': file });

        const promiseStream = new Promise((resolve, reject) => {
            fs.stat(file, (error) => {
                if (error) {
                    const error_stream = 'No resource file: ' + client.req.url;
                    reject(error_stream);
                }
                else {
                    const stream = fs.createReadStream(file);

                    // log({ 'client.mimeType': client.mimeType, 'client.res.url': client.res.url });
                    //
                    // // log({ 'client.mimeType': client.mimeType, 'stream': stream });
                    //
                    // client.res.setHeader('Content-Type', client.mimeType);
                    // // const stream = entries.content['stream'];
                    //
                    //
                    // stream.pipe(client.res);
                    // // client.res.end();
                    //
                    //
                    // log(`Served resource file and resolve promise: ${name}`);
                    // log(`\n-------------------------------\n`);

                    resolve(stream);
                }
            });
        });

        return promiseStream;
    }

    exists(file) {
        const prom = new Promise((resolve, reject) => {
            fs.stat(file, function(err, stats) {
                if (err) {
                    reject('File not found');
                } else {
                    resolve(stats);
                }
            });
        });

        return prom.then(stats => {
            return new Promise(resolve => {
                stats._file = file;
                resolve({ state: 'read file', info: 'file ' + file, status: 'success', error: '' });
            });
        }).catch(err => {
            return new Promise(reject => {
                reject({ state: 'read file', info: 'file ' + file, status: 'failed', error: err });
            });
        });
    }
}

class Route {
    routing = {'get': {
            '/': (client, par) => this.callController(client, par),
            '/main/index': (client, par) => this.callController(client, par),
            '/main/index/*': (client, par) => this.callController(client, par),
            '/user': user,
            '/contacts': 'contacts',
            '/user/patient': () => user.patient,
            '/user/age': () => user.age,
            '/user/*': (client, par) => 'parameter=' + par[0],
            '/*': (client, par) => this.statics(client, par)
        }
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
        for (const key in this.routing['get']) {
            if (key.includes('*')) {
                const rx = new RegExp(key.replace('*', '(.*)'));
                const route = this.routing['get'][key];
                this.matching.push([rx, route]);
                delete this.routing['get'][key];
            }
        }
    };

    resolve() {
        let par;
        let route = this.routing['get'][this.client.req.url];
        const renderObj = {};
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
        if (this.client.mimeType === 'text/html; charset=UTF-8') {
            const arr = this.client.req.url.split('/');
            this.client.controller = arr[1] ? arr[1] : 'main';
            this.client.method = arr[2] ? arr[2] : 'index';
        }
        renderObj.client = this.client;
        renderObj.route = route;
        renderObj.renderer = renderer;
        renderObj.intraspectionRendererParams = getFunctionParams(renderer);
        renderObj.par = par;
        // log(renderObj.renderer);
        return renderObj;
    };

    statics(client) {
        // log(client);

        const prom = new Promise((resolve) => resolve(new Files().serve(client)));
        return prom.then(stream => {

            // log({ 'stream statics()': stream, 'client.mimeTypes': client.mimeTypes });

            // let ret = null;
            //
            // if (stream.status === 'failed') {
            //     // stream.stream = this.callController(client, 'main', 'notFound');
            // }

            // log({ 'stream statics()': stream, 'client.mimeTypes': client.mimeTypes, });

            return stream;
        }).catch(error_stream => {
            console.log({ 'Error stream': error_stream });
            return null;
        });
    };

    callController(client, controllerName='main', action='index', data=null) {
        controllerName = (client.controller) ? client.controller : controllerName;
        action = (client.action) ? client.action : action;
        const prom = new Promise((resolve) => {
            resolve(controller.call(client, controllerName, action, data));
        });
        return prom.then(data => {
            return new Promise(resolve => {
                const entries = {
                    state: 'call controller',
                    info: 'controller' + controllerName,
                    status: 'success',
                    error: '',
                    stream: data
                };
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
        // return controller.call(client, controllerName, action, data);
    };
}

class Server {
    constructor() {};

    render = fn => {
        return fn.renderer(fn.route, fn.par, fn.client)
    }

    execute(client) {
        return Promise.resolve()
            .then(() => {
                return new Route(client).resolve();
            })
            .then(fn => {
                // log({ 'fn': fn });
                return this.render(fn);
            })
            .then(content => {
                return {
                    content: content,
                    data: {
                        patient: 'Иванов И.И.',
                        doctor: 'Новожилов С.Ю.'
                    }
                }
            })
            .catch(err => {
                console.log({ 'Error while execute': err });
                return null;
            });

    }

    createServer(port, host) {
        const server = http.createServer((req, res) => {
            let client = { req, res };

            // log({ 'res': res });

            const send = entries => {
                // res.setHeader('Content-Type', client.mimeType);
                const content = entries.content['stream'];

                // log({ 'client.mimeType': client.mimeType, 'entries': entries });

                if (client.mimeType === 'text/html; charset=UTF-8') {
                    res.setHeader('Content-Type', client.mimeType);
                    if (content === null) {
                        res.write('404 not found');
                        // res.write(content);
                    } else {
                        res.write(content);
                        // res.write('404 not found @');
                    }
                    res.end();
                } else {
                    // log({ 'client.mimeType': client.mimeType, 'entries': entries });

                    if (content instanceof Promise) {
                        res.setHeader('Content-Type', client.mimeType);
                        // log({ 'content instanceof Promise': content instanceof Promise });

                        // log({ 'client.mimeType': client.mimeType, 'entries': entries });

                        content.then(stream => {
                            // log({ 'stream': stream });
                            // return stream;

                            if (stream) {
                                res.setHeader('Content-Type', client.mimeType);
                                // log({ 'stream@': client.req.url });
                                // console.log({ 'stream': stream });
                                stream.pipe(res);
                                // res.end();
                            }
                        }).catch(error_stream => {
                            console.log({ 'Error stream in send': error_stream });

                        });
                    } else {
                        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
                        res.write('<h3>404 not found </h3>');
                        res.write('<h5>' + client.mimeType + '</h5>');
                        res.end();
                        log({ 'content instanceof Promise': content instanceof Promise });
                    }
                }

                // log('\n-----------------------------\n');
            };

            if (req.method === 'GET') {
                const { url } = req;

                client.name = url;
                client.fileExt = path.extname(client.name).substring(1);
                client.mimeType = MIME_TYPES[client.fileExt] || MIME_TYPES.html;

                const data = this.execute(client);

                // log({ 'content': content });

                data.then(entries => {
                    send(entries);
                });
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
}

module.exports = new Server();
