'use strict'

/**
 * Получить список параметром функции.
 * @param fn Функция
 */
const getFunctionParams = fn => {
    const COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/gm;
    const DEFAULT_PARAMS = /=[^,]+/gm;
    const FAT_ARROW = /=>.*$/gm;
    const ARGUMENT_NAMES = /([^\s,]+)/g;

    const formattedFn = fn
        .toString()
        .replace(COMMENTS, "")
        .replace(FAT_ARROW, "")
        .replace(DEFAULT_PARAMS, "");

    const params = formattedFn
        .slice(formattedFn.indexOf("(") + 1, formattedFn.indexOf(")"))
        .match(ARGUMENT_NAMES);

    return params || [];
};

const getFullName = (name, surname, middlename, data) => {
    console.log(surname + ' ' + name + ' ' + middlename, data);
};
console.log(getFunctionParams(getFullName)); // ["name", "surname", "middlename"]

// const toString = getFullName.toString();

// console.log({ 'toString': getFullName.toString() });





const obj = { a: 1 };
obj.__proto__ = { b: 2 };

console.log({ 'obj': obj, 'obj.a': obj.a, 'obj.b': obj.b });
console.log({ 'obj.__proto__': obj.__proto__ });
console.log({ 'obj.prototype': obj.prototype });
console.log(obj.hasOwnProperty('a')); // true
console.log(obj.hasOwnProperty('b')) // false





/**
 * Получить строковое представление тела функции.
 * @param fn Функция
 */
const getFunctionBody = fn => {
    const restoreIndent = body => {
        const lines = body.split("\n");
        const bodyLine = lines.find(line => line.trim() !== "");
        let indent = typeof bodyLine !== "undefined" ? (/[ \t]*/.exec(bodyLine) || [])[0] : "";
        indent = indent || "";

        return lines.map(line => line.replace(indent, "")).join("\n");
    };

    const fnStr = fn.toString();
    const rawBody = fnStr.substring(
        fnStr.indexOf("{") + 1,
        fnStr.lastIndexOf("}")
    );
    const indentedBody = restoreIndent(rawBody);
    const trimmedBody = indentedBody.replace(/^\s+|\s+$/g, "");

    return trimmedBody;
};

// Получим список параметров и тело функции getFullName
const getFullName2 = (name, surname, middlename) => {
    console.log(surname + ' ' + name + ' ' + middlename);
};
console.log(getFunctionBody(getFullName));
console.log(getFunctionBody(getFullName2));






const { http, fs, path, db, controller, STATIC_PATH } = require('./bootstrap.js');

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
    static serve(client) {
        const { req, name } = client;
        const filePath = path.join(STATIC_PATH, name);
        console.log({ 'url client': client.req.url, 'client.mimeType': client.mimeType });
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
                    console.log(`\n-------------------------------\n`);

                    resolve(stream);
                }
            });
        });
        return promiseStream;
    };
}

class Route {
    routing = {
        '/': (client, par) => this.callController(client, par),
        '/main/index': (client, par) => this.callController(client, par),
        '/main/index/10': (client, par) => this.callController(client, par),
        '/user': user,
        '/contacts': 'contacts',
        '/user/patient': () => user.patient,
        '/user/age': () => user.age,
        '/user/*': (client, par) => 'parameter=' + par[0],
        '/*': (client) => this.statics(client)
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
    };

    resolve() {
        // console.log({ 'routing': this.routing });
        // console.log({ 'matching': this.matching });
        let par;
        let route = this.routing[this.client.req.url];
        let renderObj = {};

        const arr = this.client.req.url.split('/');
        renderObj.controller = arr[1] ? arr[1] : '';
        renderObj.method = arr[2] ? arr[2] : '';

        console.log({ 'renderObj': renderObj });

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
        this.client.res.writeHead(200, { 'Content-Type': this.client.mimeType });

        renderObj.client = this.client;
        renderObj.route = this.route;
        renderObj.par = this.par;

        const result = renderer(route, par, this.client);
        console.log({ 'result': result });



        return result;
    };

    statics(client) {
        const promStream = new Promise((resolve) => {
            resolve(Files.serve(client));
        });
        promStream.then(stream => {
            if (stream) {
                // console.log({ 'stream': stream });
                stream.pipe(client.res);
            }
        }).catch(error_stream => {
            console.log({ 'error_stream': error_stream });
            // client.res.writeHead(200, { 'Content-Type': client.mimeType });
            client.res.end('404 not found (statics)');
        });
    };

    static test(client) {
        client.res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        client.res.end('test');

    };

    notFound(client) {
        controller.call(client, 'main', 'notFound', null);
    }

    callController(client, controllerName='main', action='index', data=null) {
        controller.call(client, controllerName, action, data);
    };
}

class Server {
    constructor() {};

    execute(client) {
        Promise.resolve()
            .then(() => {
                new Route(client).resolve();

                // return route(client);
            })
            .then(renderingObject => {
                // return renderingObject;

                // Route.test(client);
                // console.log('before getData()');
                // console.log({ 'renderingObject': renderingObject });
                // return getData(renderingObject)
            })
            .then(data => {
                console.log('.then 2');
                // return render(data);
            })
            .catch(err => {
                console.log('error while working on item 1', err);
            });

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

                this.execute(client);

                // client.res.end();

                // this.statics(client);

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