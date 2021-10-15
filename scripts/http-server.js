const http = require('http');
const path = require('path');
const fs = require('fs');
// const mimeTypes = require('../constants');

const cName = 'Main';
const mainController = require('../controllers/' + cName + '.js');

const routes = require('../routes');

// console.log({ 'mainController': mainController });

class Server {
    start(port, host, route) {
        this.createServer(port, host, route);
    }

    createServer(port, host, route) {
        const server = http.createServer((req, res) => {
            const requireController = (name) => {
                return require('../controllers/' + name + '.js');
            };

            const spread = (...args) => {

                return args;
            }

            console.log({ 'test': spread({'up': 'down'}, 'foo', 'bar') });

            const run = ((res, handler, action, params=null) => {
                const controllerName = handler;
                const controllerMethod = action;

                const controllerClass = requireController(controllerName);
                const controller = new controllerClass();

                controller[controllerMethod](params);

                res.setHeader('Content-Type', 'text/html');
                res.write('Status: ' + res.statusCode) + ' OK';
                res.end();

                return 'run success';
            });

            let findRoute = route.findRoute(req.url, routes, req.method);
            console.log({ 'findRoute': findRoute });

            if (req.method == 'GET') {
                !findRoute ? mainController.not_found_404(res) : mainController.success(res, 'get success');
            }

            if (req.method == 'POST') {
                if (!findRoute) {
                    mainController.not_found_404(res);
                } else {
                    let body = '';

                    req.on('data', function(chunk) {
                        body += chunk.toString();
                    });

                    run(res, findRoute.handler, findRoute.action, body);

                    // mainController.success(res, 'post success');
                }
            }

            if (req.method == 'PUT') {
                mainController.success(res, 'put');
            }


            req.on('end', function() {
                console.log('req.on: end | req.method = ' + req.method);
            });
        });

        server.on('request', function(request, response) {
            console.log('server request');

            // response.writeHead(200);
            // console.log(request.method);
            // console.log(request.headers);
            // console.log(request.url);
            // response.write('hi');
            // response.end();
        });

        server.listen(port, host, () => {
            console.log(`Server running at http://${host}:${port}/`);
        });
    }
}

module.exports = new Server();