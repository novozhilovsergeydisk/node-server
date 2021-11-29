'use strict'

const { http, fs, path, log, controller, STATIC_PATH, getFunctionParams } = require('./bootstrap.js');

const MIME_TYPES = {
    html: 'text/html; charset=UTF-8',
    js:   'application/javascript; charset=UTF-8',
    css:  'text/css',
    png:  'image/png',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    ico:  'image/x-icon',
    svg:  'image/svg+xml',
    ttf: 'application/x-font-ttf',
    otf: 'application/x-font-ttf'
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

class Aux {
    static setHeader = client => {
        client.res.setHeader('Platform-Type', 'SmartJS');
        client.res.setHeader('Content-Type', client.mimeType);
    }

    static callController = (client, controllerName='main', action='index', data=null) => {
        log({ 'controllerName': controllerName, 'action': action });

        // controllerName = (client.controller) ? client.controller : controllerName;
        action = (client.action) ? client.action : action;
        const prom = new Promise((resolve) => {
            log({ 'controllerName 2': controllerName, 'action 2': action });

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
    };

    static statics = client => {
        // log(client);

        const prom = new Promise((resolve) => resolve(new Files().serve(client)));
        return prom.then(stream => {
            // if (stream.status === 'failed') {
            //     // stream.stream = this.callController(client, 'main', 'notFound');
            // }

            return stream;
        }).catch(error_stream => {
            console.log({ 'Error stream': error_stream });
            return null;
        });
    };

    static render = fn => {
        return fn.renderer(fn.route, fn.par, fn.client)
    }

    static execute = client => {
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

    static send = (entries, client) => {
        const content = entries.content['stream'];
        if (client.mimeType === 'text/html; charset=UTF-8') {
            this.setHeader(client);
            if (content === null || content === undefined) {
                client.res.end('404 not found');
            } else {
                client.res.end(content);
            }
        } else {
            if (content instanceof Promise) {
                this.setHeader(client);
                // log({ 'content instanceof Promise': content instanceof Promise });
                // log({ 'client.mimeType': client.mimeType, 'entries': entries });
                content.then(stream => {
                    // log({ 'stream': stream });
                    // return stream;
                    if (stream) {
                        this.setHeader(client);
                        // log({ 'stream@': client.req.url });
                        // console.log({ 'stream': stream });
                        stream.pipe(client.res);
                        // res.end();
                    }
                }).catch(error_stream => {
                    console.log({ 'Error stream in send': error_stream });
                });
            } else {
                client.res.setHeader('Content-Type', 'text/html; charset=UTF-8');
                client.res.write('<h3>404 not found!</h3>');
                client.res.end('<h5>' + client.mimeType + '</h5>');
                log({ 'content instanceof Promise': content instanceof Promise });
            }
        }
        // log('\n-----------------------------\n');
    };
}

class Route {
    routing = {'GET': {
            '/': (client, par) => Aux.callController(client, 'main', 'index', par),
            '/index': (client, par) => Aux.callController(client, 'main', 'index', par),
            '/index/*': (client, par) => Aux.callController(client, 'main', 'index', par),
            '/user': user,
            '/user/patient': () => user.patient,
            '/user/age': () => user.age,
            '/user/*': (client, par) => 'parameter=' + par[0],
            '/*': (client, par) => Aux.statics(client, par)
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
        for (const key in this.routing[client.http_method]) {
            if (key.includes('*')) {

                log({ 'key.replace()': '^' + key.replace('*', '(.*)') });

                const rx = new RegExp('^' + key.replace('*', '(.*)'));
                const route = this.routing[client.http_method][key];
                this.matching.push([rx, route]);
                delete this.routing[client.http_method][key];
            }
        }
    };

    resolve() {
        log({ 'this.matching': this.matching });

        let par;
        let route = this.routing['GET'][this.client.req.url];
        const renderObj = {};
        if (!route) {
            for (let i = 0; i < this.matching.length; i++) {
                const rx = this.matching[i];

                par = this.client.req.url.match(rx[0]);

                log({ 'this.client.req.url': this.client.req.url, 'rx[0]': rx[0], 'par': par });

                if (par) {
                    par.shift();
                    route = rx[1];
                    break;
                }
            }
        }

        log({ 'route': route });

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
}

class Server {
    constructor() {};

    // render = fn => {
    //     return fn.renderer(fn.route, fn.par, fn.client)
    // }

    createServer(port, host) {
        const server = http.createServer((req, res) => {
            let client = { req, res };
            // log({ 'res': res });

            if (req.method === 'GET') {
                try {
                    const { url } = req;
                    client.http_method = req.method;
                    client.name = url;
                    client.fileExt = path.extname(client.name).substring(1);
                    client.mimeType = MIME_TYPES[client.fileExt] || MIME_TYPES.html;
                    const data = Aux.execute(client);
                    // log({ 'content': content });
                    data.then(entries => {
                        Aux.send(entries, client);
                    });
                } catch(err) {
                    log({ 'Error while execute()': err });
                }
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