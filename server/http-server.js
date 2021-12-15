'use strict'

const { http, path, log, Route, Client } = require('./bootstrap.js');
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

const resolve = data => {
    return new Promise(resolve => {
        console.log({ 'resolve(data)': data });
        resolve(data);
    });
}

const reject = error => {
    return new Promise(reject => {
        console.log({ 'reject(error)': error });
        reject(error);
    });
}

class Server {
    constructor() {};

    execute = client => {
        return Promise.resolve()
            .then(() => {
                // log({ client });
                return new Route(client).resolve();
            })
            .then(fn => {
                // log({ 'fn': fn });
                return fn.renderer(fn.route, fn.par, fn.client);
            })
            .then(content => {
                // log({ content });
                content = (content === 'not found') ? {} : content;
                return { content: content };
            })
            .catch(err => {
                console.log({ 'Error while execute': err });
                return null;
            });
    }

    createServer(port, host) {
        const server = http.createServer(async (req, res) => {
            const { url } = req;
            let client = {};
            client.http_method = req.method;
            client.name = url;
            client.fileExt = path.extname(client.name).substring(1);
            client.mimeType = MIME_TYPES[client.fileExt] || MIME_TYPES.html;
            try {
                this.execute(client).then(entries => {
                    const content = entries.content['stream'];
                    if (client.mimeType === 'text/html; charset=UTF-8') {
                        res.setHeader('Content-Type', client.mimeType);

                        if (content === null || content === undefined) {
                            res.statusCode = 404;
                            res.end('404 not found');
                        } else {
                            const html = ((typeof content) ==='string' ) ? content : content.toString();
                            res.statusCode = 200;
                            res.end(html);
                        }
                    } else {
                        if (content instanceof Promise) {
                            res.setHeader('Content-Type', client.mimeType);
                            content.then(stream => {
                                if (stream) {
                                    res.setHeader('Content-Type', client.mimeType);
                                    stream.pipe(res);
                                }
                            }).catch(error_stream => {
                                console.log({ 'Error stream in send': error_stream });
                            });
                        } else {
                            res.setHeader('Content-Type', 'text/html; charset=UTF-8');
                            res.end('<h3>404 not found!</h3>');
                        }
                    }
                });
            } catch(err) {
                log({ 'Error while execute()': err });
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