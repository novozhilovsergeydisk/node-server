'use strict'

const { http, path, log, end, Route, Client } = require('./bootstrap.js');
const { auth, user, admin, Car } = require('./classes/auth.js');
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

const tesla = new Car('Tesla', 'silver');
log({ tesla });

// user.fullName = 'Новожилов Сергей';
// const isAuth = auth.login();
// log({ isAuth });

// alert(admin.fullName); // John Smith (*)
//
// // срабатывает сеттер!
// admin.fullName = "Alice Cooper"; // (**)
// alert(admin.name); // Alice
// alert(admin.surname); // Cooper

console.table([{doctor: 'Новожилов С.Ю.'}, {patient: 'Иванов Т.Ф.', sys: 143, dia: 89, pulse: 54, glukose: 5.9}, {patient: 'Петров А.М.', sys: 133, dia: 79, pulse: 64}, {patient: 'Сидоров А.М.', sys: 123, dia: 69, pulse: 74}]);

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
    log('404 - ' + client.name);
    if (error) log({ 'error': error });
};

const send = ((mimeType, html, res) => {
    res.setHeader('Content-Type', mimeType);
    res.statusCode = 200;
    res.end(html);
});

class Server {
    constructor() {};
    execute(client) {
        return Promise.resolve()
            .then(() => {
                const resolve = new Route(client).resolve();

                // log({ resolve });

                return resolve;
            })
            .then(data => {
                // user.fullName = 'Новожилов Сергей';
                // const isAuth = auth.login();
                // log({ isAuth });

                return data;
            })
            .catch(err => {
                console.log({ 'Error execute()': err });
                return null;
            });
    };

    strategyVariant(client, content, res) {

        // log({ content });

        if (client.mimeType === 'text/html; charset=UTF-8') {
            if (content === null || content === undefined) {
                __404(client, res);
            } else {
                if (content instanceof Promise) {
                    content.then(data => {
                        if (data === null) __404(client, res);
                    });
                } else {
                    const html = ((typeof content) ==='string' ) ? content : content.toString();
                    send(client.mimeType, html, res);
                }
            }
        } else {
            if (typeof content === 'object') {
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
            try {
                this.execute(client).then(data => {
                    // log({ 'url': url, 'mime': client.mimeType });

                    // log({ data });

                    // const content = data.stream;
                    this.strategyVariant(client, data.stream, res);
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

// 'use strict';
//
// var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
//
// var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
//
// function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
//
// var Server = function () {
//     function Server() {
//         _classCallCheck(this, Server);
//     }
//
//     _createClass(Server, [{
//         key: 'execute',
//         value: function execute(client) {
//             return Promise.resolve().then(function () {
//                 var resolve = new Route(client).resolve();
//
//                 // log({ resolve });
//
//                 return resolve;
//             }).then(function (data) {
//                 // user.fullName = 'Новожилов Сергей';
//                 // const isAuth = auth.login();
//                 // log({ isAuth });
//
//                 return data;
//             }).catch(function (err) {
//                 console.log({ 'Error execute()': err });
//                 return null;
//             });
//         }
//     }, {
//         key: 'strategyVariant',
//         value: function strategyVariant(client, content, res) {
//
//             // log({ content });
//
//             if (client.mimeType === 'text/html; charset=UTF-8') {
//                 if (content === null || content === undefined) {
//                     __404(client, res);
//                 } else {
//                     if (content instanceof Promise) {
//                         content.then(function (data) {
//                             if (data === null) __404(client, res);
//                         });
//                     } else {
//                         var html = typeof content === 'string' ? content : content.toString();
//                         send(client.mimeType, html, res);
//                     }
//                 }
//             } else {
//                 if ((typeof content === 'undefined' ? 'undefined' : _typeof(content)) === 'object') {
//                     content.then(function (stream) {
//                         res.setHeader('Content-Type', client.mimeType);
//                         if (stream) {
//                             stream.pipe(res);
//                         } else {
//                             __404(client, res);
//                         }
//                     }).catch(function (error_stream) {
//                         __404(client, res);log({ 'error_stream': error_stream });
//                     });
//                 } else {
//                     __404(client, res);
//                 }
//             }
//         }
//     }, {
//         key: 'createServer',
//         value: function createServer(port, host) {
//             var _this = this;
//
//             var server = http.createServer(async function (req, res) {
//                 var url = req.url;
//
//                 var fileExt = path.extname(url).substring(1);
//                 var mimeType = MIME_TYPES[fileExt] || MIME_TYPES.html;
//                 var client = new Client(req.headers.host, req.method, url, fileExt, mimeType);
//                 try {
//                     _this.execute(client).then(function (data) {
//                         // log({ 'url': url, 'mime': client.mimeType });
//
//                         // log({ data });
//
//                         // const content = data.stream;
//                         _this.strategyVariant(client, data.stream, res);
//                     });
//                 } catch (err) {
//                     log({ 'Error while execute()': err });
//                 }
//                 req.on('end', function () {
//                     // console.log('end');
//                 });
//             });
//
//             server.on('request', function (req, res) {
//                 // const client = { req, res };
//                 // console.log('On server request url: ' + req.url);
//                 // this.statics(client);
//             });
//
//             server.listen(port, host, function () {
//                 console.log('Server running at http://' + host + ':' + port + '/');
//             });
//         }
//     }, {
//         key: 'start',
//         value: function start(port, host) {
//             this.createServer(port, host);
//         }
//     }]);
//
//     return Server;
// }();

module.exports = new Server();