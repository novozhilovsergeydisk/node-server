const http = require('http');
// const path = require('path');
const fs = require('fs');
// const { mimeTypes } = require('../constants.js');
const { appPath } = require('../constants.js');
const cName = 'Main';
const mainController = require('../controllers/' + cName + '.js');
const routes = require('../routes.json');
const capitalizeFirstLetter = require('./capitalize-first-letter');
// const mime = require('mime');
// const util = require('util');
// const logger = require("../../node_modules/webpack-cli/lib/utils/logger.js");
// const promise = import('events');

const { logger } = require(appPath + '/utils/Logger');

logger.info();

// const { createLogger, format, transports } = require('winston');
// const logLevels = {
//     fatal: 0,
//     error: 1,
//     warn: 2,
//     info: 3,
//     debug: 4,
//     trace: 5,
// };

// ex 1 -------------
// console.log('\x1Bc');
// const buffer = fs.readFileSync('./server.js', 'utf8');
// const src = buffer.toString();
// const lines = src.split('\n').filter(line => !!line);
// const str = lines.join('\n');
// fs.writeFileSync('1-test.txt', str);
// console.log({ 'buffer': buffer, 'src': src, 'lines': lines, 'str': str });
// END ex -------------

// ex 2 -------------
// const { createHmac } = require('crypto');
// const secret = 'abcdefg';
// const hash = createHmac('sha256', secret)
//     .update('I love cupcakes')
//     .digest('hex');
// console.log(hash);
// const constantsPath = require.resolve('../constants.js');
// console.log({ 'constantsPath': constantsPath });
// console.log({ 'require.cache': require.cache });
// console.log({ 'appPath': appPath });
// END ex -------------



class Server {
    start(port, host, route) {
        this.createServer(port, host, route);
    }

    createServer(port, host, route) {

        // console.log({ 'route.__proto__': route.__proto__, 'route.prototype': route.prototype });

        const server = http.createServer((req, res) => {
            logger.run();

            // asyncLocalStorage.run(idSeq++, () => {
            //     logWithId('start');
            //     // Imagine any chain of async operations here
            //     setImmediate(() => {
            //         logWithId('finish');
            //         // res.end();
            //     });
            //
            //     // logger.info({ 'req.url': req.url });
            // });

            const requireController = (name) => {
                const controller_path = '../controllers/' + capitalizeFirstLetter(name) + '.js';
                // console.log({ 'controller_path': controller_path });

                return require(controller_path);
            };

            // res.prototype = spread;

            // console.log({ 'test': spread({'up': 'down'}, 'foo', 'bar') });

            const runControllerMethod = ((res, handler, action, params=null) => {
                try {
                    const controllerName = handler;
                    const controllerMethod = action;

                    console.log({ 'controllerMethod': controllerMethod });

                    console.log({ 'controllerName': controllerName });

                    const controllerClass = requireController(controllerName);

                    console.log({ 'controllerClass': controllerClass });

                    const controller = new controllerClass(res);

                    // console.log({ 'controller': controller });

                    controller[controllerMethod](params);

                    return 'success';
                } catch(err) {
                    console.log({ 'err': err });
                    return 'error';
                }
            });

            let findRoute = route.findRoute(req, routes);

            console.log({ 'findRoute': findRoute });

            if (req.method == 'GET') {

                if (/^\/img\/[a-z_]+\.((png)|(jpg)|(ico)|(gif)|(svg))$/.test(req.url)) {
                    const imagePath = appPath + '/src' + req.url;
                    // const mimeType = mime.lookup(req.url);

                    // console.log({ 'mimeType': mimeType });

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

                    // console.log({ 'mime.lookup(req.url)': mime.lookup(req.url) });

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

                if (!findRoute) {
                    mainController.not_found_404(req, res);
                } else {
                    runControllerMethod(res, findRoute.handler, findRoute.action);
                }

                return;
            }

            if (req.method == 'POST') {

                if (!findRoute) {
                    mainController.not_found_404(req, res);
                } else {
                    let body = '';

                    req.on('data', function(chunk) {
                        console.log({ 'chunk': chunk });

                        body += chunk.toString();

                        console.log({ 'body': body });

                        runControllerMethod(res, findRoute.handler, findRoute.action, body);
                    });

                    console.log({ 'body out': body });

                    // runControllerMethod(res, findRoute.handler, findRoute.action, body);
                }
            }

            if (req.method == 'PUT') {
                mainController.success(res, 'put');
            }

            req.on('end', function() {
                // logger.info('end');
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