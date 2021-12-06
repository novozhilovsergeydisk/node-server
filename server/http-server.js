'use strict'

const { http, path, log, controller, Route } = require('./bootstrap.js');
const Client = require('./classes/Client.js');
// const Session = require('./classes/Session.js');

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

class Server {
    constructor() {};
    // render = fn => {
    //     return fn.renderer(fn.route, fn.par, fn.client)
    // }

    execute = client => {
        return Promise.resolve()
            .then(() => {
                return new Route(client).resolve();
            })
            .then(fn => {

                log({ 'fn': fn });

                return fn.renderer(fn.route, fn.par, fn.client);
            })
            .then(content => {

                log({ 'content': content });

                if (content === 'not found') {
                    content = {};
                }

                content.data = {
                    patient: 'Иванов И.И.',
                    doctor: 'Новожилов С.Ю.'
                };

                return { content: content };
            })
            .catch(err => {
                console.log({ 'Error while execute': err });
                return null;
            });
    }

    createServer(port, host) {
        const server = http.createServer(async (req, res) => {
            let client = {}; // { req, res };
            // log({ 'res': res });
            if (req.method === 'GET') {
                try {
                    const { url } = req;

                    const clientObj = new Client(req, res);
                    const cookies = clientObj.getCookie();

                    if (cookies instanceof Promise) {
                        cookies.then(data => {
                            log({ 'url': url, 'data': data });
                        });
                    }

                    client.http_method = req.method;
                    client.name = url;
                    client.fileExt = path.extname(client.name).substring(1);
                    client.mimeType = MIME_TYPES[client.fileExt] || MIME_TYPES.html;

                    this.execute(client).then(entries => {
                        const content = entries.content['stream'];
                        if (client.mimeType === 'text/html; charset=UTF-8') {
                            res.setHeader('Content-Type', client.mimeType);
                            if (content === null || content === undefined) {
                                res.end('404 not found');
                            } else {
                                res.end(content);
                            }
                        } else {
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
                                res.write('<h3>404 not found!</h3>');
                                res.end('<h5>' + client.mimeType + '</h5>');
                                // log({ 'content instanceof Promise': content instanceof Promise });
                            }
                        }
                        // Aux.send(entries, client);
                    });
                } catch(err) {
                    log({ 'Error while execute()': err });
                }
            }
            if (req.method === 'POST') {
                try {
                    const { url } = req;

                    const clientObj = new Client(req, res);
                    const cookies = clientObj.getCookie();

                    if (cookies instanceof Promise) {
                        cookies.then(data => {
                            log({ 'url': url, 'data': data });
                        });
                    }

                    client.http_method = req.method;
                    client.name = url;
                    client.fileExt = path.extname(client.name).substring(1);
                    client.mimeType = MIME_TYPES[client.fileExt] || MIME_TYPES.html;

                    this.execute(client).then(entries => {
                        const content = entries.content['stream'];

                        // log({ 'entries': entries });

                        if (client.mimeType === 'text/html; charset=UTF-8') {
                            res.setHeader('Content-Type', client.mimeType);
                            if (content === null || content === undefined) {
                                res.end('404 not found');
                            } else {
                                res.end(content);
                            }
                        } else {
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
                                res.write('<h3>404 not found!</h3>');
                                res.end('<h5>' + client.mimeType + '</h5>');
                                // log({ 'content instanceof Promise': content instanceof Promise });
                            }
                        }
                        // Aux.send(entries, client);
                    });
                } catch(err) {
                    log({ 'Error while execute()': err });
                }

                // if (!findRoute) {
                //     this.notFound(client);
                // } else {
                //     let body = '';
                //
                //     req.on('data', function(chunk) {
                //         // console.log({ 'chunk': chunk });
                //
                //         body += chunk.toString();
                //
                //         controller.call(client, findRoute.handler, findRoute.action, body);
                //
                //     });
                //
                //     // console.log({ 'body out': body });
                //
                //     // ControllerMethodCall(res, findRoute.handler, findRoute.action, body);
                // }
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