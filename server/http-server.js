'use strict'

const { http, path, logger, log, end, Route, Client } = require('./bootstrap.js');

var faker = require('faker');

const randomName = faker.name.findName(); // Rowan Nikolaus
const randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
const randomCard = faker.helpers.createCard(); // random contact card containing many properties
const randomImage = faker.image.fashion();

log({ randomName, randomEmail, randomImage });

// var http = require('http');
const url = require('url');
const fs = require('fs');
//
http.createServer(function (req, res) {
    const q = url.parse(req.url, true);
    const filename = "../src" + q.pathname;log({ __dirname });

    log({ filename });
    fs.readFile(filename, function(err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
}).listen(8080);

// const { Auth } = require('./lib/auth.js');
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

// http://espressocode.top/http-headers-content-type/
// https://nodejsdev.ru/doc/email/

const CONTENT_TYPES = {
    MILTIPART_FORMDATA: 'multipart/form-data',
    MILTIPART_URLENCODED: 'application/x-www-form-urlencoded',
    APPLICATION_JSON: 'application/json'
}

// log(MIME_TYPES.html);

console.table([
    {doctor: 'Новожилов С.Ю.'},
    {patient: 'Тихонова Галина Федотовна', sys: 143, dia: 89, pulse: 54, glukose: 5.9},
    {patient: 'Багдасарян Анна Рафаэловна', sys: 133, dia: 79, pulse: 64},
    {patient: 'Каргальская Ирина Геннадьевна', sys: 123, dia: 69, pulse: 74}
]);

const resolve = data => {
    return new Promise(resolve => {
        console.log({ 'resolve(data)': data });
        resolve(data);
    });
};

const reject = error => {
    return new Promise(reject => {
        console.log({ 'reject(error)': error });
        reject(error);
    });
};

const __404 = (client, res, error = null) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.statusCode = 404;
    res.end('404 not found');
    log('404 - ' + client.url);
    if (error) log({ 'error': error });
};

const send = ((mimeType, html, res) => {
    res.setHeader('Content-Type', mimeType);
    res.statusCode = 200;
    res.end(html);
});

class Server {
    constructor() {};

    make(client, res) {
        try {
            this.execute(client).then(data => {
                // log({ data });
                this.answerStrategy(client, data.stream, res);
            });
        } catch(err) {
            log({ 'Error while execute()': err });
        }
    }

    execute(client) {
        return Promise.resolve()
            .then(() => {
                const resolve = new Route(client).resolve();

                // log({ resolve });

                return resolve;
            })
            // Здесь можно проверить аутентификацию, авторизацию пользователя
            //
            // .then(dat => {
            //     // user.fullName = 'Новожилов Сергей';
            //     // const isAuth = auth.login();
            //     // log({ isAuth });
            //
            //     log({ dat });
            //
            //     return dat;
            // })
            .catch(err => {
                console.log({ 'Error execute()': err });
                return null;
            });
    }

    answerStrategy(client, content, res) {
        const isPromice = content instanceof Promise;
        const isObject = typeof content === 'object';
        // log({ content });
        if (client.mimeType === MIME_TYPES.html) {
            if (content === null || content === undefined) {
                __404(client, res);
            } else {
                if (isPromice) {
                    content.then(data => {
                         (data === null) ? __404(client, res) : send(client.mimeType, data, res);
                    });
                } else {
                    const html = ((typeof content) ==='string' ) ? content : content.toString();
                    send(client.mimeType, html, res);
                }
            }
        } else {
            if (isPromice) {
                content
                    .then(stream => {
                        res.setHeader('Content-Type', client.mimeType);
                        if (stream) {
                            stream.pipe(res);
                        } else {
                            __404(client, res);
                        }
                    })
                    .catch(error_stream => {
                        __404(client, res); log({ 'error_stream': error_stream });
                    });
            } else {
                __404(client, res);
            }
        }
    }

    createServer(port, host) {
        const server = http.createServer(async (req, res) => {
            const { url } = req;
            const fileExt = path.extname(url).substring(1);
            const mimeType = MIME_TYPES[fileExt] || MIME_TYPES.html;
            const client = new Client(req.headers.host, req.method, url, fileExt, mimeType);

            log({ 'req.headers[content-type]': req.headers['content-type'], url });

            if (req.method === 'POST') {
                // log({ 'req.body': req.body });

                let body = '';

                req.on('data', chunk => {
                    const contentType = req.headers["content-type"];

                    log({ contentType });

                    if (contentType === CONTENT_TYPES.MILTIPART_FORMDATA) {
                        log({ chunk });
                        body += chunk.toString(); // convert Buffer to string
                        client.body = body;
                    }

                    if (contentType === CONTENT_TYPES.MILTIPART_URLENCODED) {
                        log({ chunk });

                        body += chunk.toString(); // convert Buffer to string
                    }

                    const bodyArr = body.split('&');

                    const jsonString = JSON.stringify(Object.assign({}, bodyArr))

                    log({ jsonString });

                    client.body = body;

                    if (contentType === CONTENT_TYPES.APPLICATION_JSON) {
                        log({ chunk });
                        body += chunk.toString(); // convert Buffer to string
                        client.body = body;
                    }

                    log({ body });

                    this.make(client, res);
                    // console.log(body);
                });
            }

            if (req.method === 'GET') {
                this.make(client, res);
            }

            // try {
            //     this.execute(client).then(data => {
            //         // log({ 'url': url, 'mime': client.mimeType });
            //
            //         // log({ data });
            //
            //         // const content = data.stream;
            //         this.answerStrategy(client, data.stream, res);
            //     });
            // } catch(err) {
            //     log({ 'Error while execute()': err });
            // }
            req.on('end', function() {
                // console.log('end');
            });
        });

        server.on('request', function(req, res) {
            // logger.run(req, res);

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