const http = require('http');
const path = require('path');
const fs = require('fs');
const { mimeTypes } = require('../constants.js');
const { appPath } = require('../constants.js');
const cName = 'Main';
const mainController = require('../controllers/' + cName + '.js');
const routes = require('../routes.json');
const capitalizeFirstLetter = require('./capitalize-first-letter');
const logger = require("../../node_modules/webpack-cli/lib/utils/logger.js");
const mime = require('mime');

// console.log({ 'appPath': appPath });

class Server {
    start(port, host, route) {
        this.createServer(port, host, route);
    }

    createServer(port, host, route) {

        // console.log({ 'route.__proto__': route.__proto__, 'route.prototype': route.prototype });

        const server = http.createServer((req, res) => {
            const requireController = (name) => {
                const controller_path = '../controllers/' + capitalizeFirstLetter(name) + '.js';
                // console.log({ 'controller_path': controller_path });

                return require(controller_path);
            };

            const spread = (...args) => {

                // console.log(args.length);
                //
                // args.forEach(item => {
                //     console.log(item);
                // });

                return args;
            }

            // res.prototype = spread;

            // console.log({ 'test': spread({'up': 'down'}, 'foo', 'bar') });

            const run = ((res, handler, action, params=null) => {
                try {

                    // console.log({ 'handler': handler });

                    const controllerName = handler;
                    const controllerMethod = action;

                    // console.log({ 'controllerName': controllerName });

                    const controllerClass = requireController(controllerName);

                    // console.log({ 'controllerClass': controllerClass });

                    const controller = new controllerClass();

                    // console.log(controller);

                    controller[controllerMethod](res);

                    // console.log({ 'readStream': readStream });



                    //res.setHeader('Content-Type', 'text/html');

                    // if (readStream) {
                    //     readStream.pipe(res);
                    // } else {
                    //     res.write('Status: ' + res.statusCode) + 'No render';
                    // }

                    //res.write('Status: ' + res.statusCode) + ' OK';

                    //res.end();

                    return 'run success';
                } catch(err) {
                    console.log({ 'err': err });
                    return 'run error';
                }
            });

            let findRoute = route.findRoute(req, routes);
            // console.log({ 'findRoute': findRoute });

            if (req.method == 'GET') {

                // console.log({ 'res.prototype': res.prototype });

                console.log({ 'req.url': req.url });

                if (/^\/img\/[a-z_]+\.((png)|(jpg)|(ico)|(gif)|(svg))$/.test(req.url)) {
                    const imagePath = appPath + '/src' + req.url;
                    const mimeType = mime.lookup(req.url);

                    console.log({ 'mimeType': mimeType });

                    fs.readFile(imagePath, (err, data) => {
                        if (err) {
                            res.writeHead(404);
                            return res.end("File not found.");
                        } else {
                            // console.log({ 'data': data });

                            let img = fs.readFileSync(imagePath);
                            res.writeHead(200, {'Content-Type': 'image/png' });
                            res.end(img, 'binary');

                            // res.writeHead(200, {'Content-Type': mimeType});
                            // res.write(fs.readFileSync(imagePath, 'utf8'));
                            // res.end(imagePath, 'binary');
                        }
                    });

                    // res.writeHead(200, {'Content-Type': 'text/css'});
                    // res.write(imagePath);
                    // res.end();

                    return;
                }

                if (/^\/css\/[a-z_]+\.css$/.test(req.url)) {
                    const cssPath = appPath + '/src' + req.url;

                    console.log({ 'mime.lookup(req.url)': mime.lookup(req.url) });

                    // const readStream = fs.createReadStream(cssPath, 'utf8');

                    // console.log({ 'readStream': readStream });

                    // if (readStream) {
                    //     res.setHeader("Content-Type", 'text/css');
                    //     readStream.pipe(res);
                    //     res.end();
                    //     return 'success css';
                    // }

                    fs.readFile(cssPath, function(err, data) {
                        if (err) {
                            res.writeHead(404);
                            return res.end("File not found.");
                        } else {
                            // console.log({ 'data': data });

                            res.writeHead(200, {'Content-Type': 'text/css'});
                            res.write(fs.readFileSync(cssPath, 'utf8'));
                            res.end();
                        }
                    });

                    return;
                }

                // if (req.url === '/css/style.css') {
                //     res.setHeader('Content-Type', 'text/css');
                //     res.end('css');
                //     return;
                // }

                // console.log({ 'req.url': req.url });

                if (!findRoute) {
                    mainController.not_found_404(res);
                } else {
                    run(res, findRoute.handler, findRoute.action);
                }
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
                // logger.info(logger);
                // console.log('req.on: end | req.method = ' + req.method);
            });
        });

        // server.on('request', function(request, response) {
        //     console.log('server request');
        // });

        server.listen(port, host, () => {
            console.log(`Server running at http://${host}:${port}/`);
        });
    }
}

module.exports = new Server();