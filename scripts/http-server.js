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
            let findRoute = '';

            const requireController = (name) => {
                const controllerPath = '../controllers/' + name + '.js';

                console.log(controllerPath);

                return require(controllerPath);
            };

            // console.log({ 'url': req.url, 'method': req.method });

            if (req.method == 'PUT') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.write('<h1>Handler PUT</h1>');
                res.end('<h3>transplant.net</h3>');
            }

            if (req.method == 'GET') {
                findRoute = route.findRoute(req.url, routes, req.method);

                console.log({ 'findRoute': findRoute });

                if (!findRoute) {
                    console.log({ 'res.statusCode': res.statusCode });

                    mainController.not_found_404(res);
                } else {
                    if (req.url == '/favicon.ico') {
                        // res.setHeader('Content-Type', 'text/html');
                        // res.end('Resourse ' + req.url + ' not found!\n');
                    } else {
                        // const find = route.find(req.url, routes, req.method);

                        // mainController[route.action](response);

                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'text/html');
                        res.write('<h1>Method GET</h1>');
                        res.end('<h3>transplant.net</h3>');

                        // const controller = find['route'];

                        // const action = find['route']['action'];
                        //
                        // mainController[action](res);
                        //
                        // console.log(find['route']['action']);
                    }
                }
            }

            if (req.method == 'POST') {
                findRoute = route.findRoute(req.url, routes, req.method);
                console.log({ 'findRoute': findRoute });

                if (!findRoute) {
                    console.log(res.statusCode);

                    // res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html');
                    res.write('<h1>Error</h1>');
                    res.write('<h3>404 NOT FOUND</h3>h3>');
                    res.end();
                } else {

                }

                // const controllerName = findRoute.name;
                // const controllerMethod = findRoute.methodName;

                // const controllerClass = requireController(controllerName);
                // const controller = new controllerClass();
                // console.log(controller[controllerMethod]());

                // let body = '';
                //
                // req.on('data', function(chunk) {
                //     body += chunk.toString();
                // });
                //
                // req.on('end', function() {
                //     res.statusCode = 200;
                //     res.setHeader('Content-Type', 'text/html');
                //     res.write('END');
                //     res.end();
                // });

                // res.statusCode = 200;
                // res.setHeader('Content-Type', 'text/html');
                // res.end('<h3>Method POST</h3>');
            }

            //Users/sergionov/Projects/transplant.net/home/docs/Клинические_рекомендации_для_реципиента_донорского_сердца.pdf

            // file.serve(req, res);

            // const content = mainController.index();

            // if (req.url == '/') {
            //     res.statusCode = 200
            //     res.setHeader('Content-Type', 'text/html');
            //     // mainController.index(res);
            //
            //     const content = mainController.index(res);
            //
            //     // const myReadStream = fs.createReadStream(__dirname + '/src/pages/index.html', 'utf8');
            //     // myReadStream.pipe(res);
            //
            //     res.end(content);
            // } else if (res.statusCode == 404) {
            //     res.setHeader('Content-Type', 'text/html');
            //     res.end('Page not found\n');
            // } else if (req.url == '/favicon.ico') {
            //     res.setHeader('Content-Type', 'text/html');
            //     res.end('Resourse ' + req.url + ' not found!\n');
            // } else {
            //     // console.log('__dirname', __dirname);
            //     // console.log('filePath=', filePath);
            //
            //     fs.exists(filePath, function (exists, err) {
            //         const ext = '.css';
            //
            //         //console.log({'ext': '.css', 'mimeTypes': mimeTypes, 'exists': exists});
            //
            //         // Если запрошенный ресурс не существует, то ответ: 404 Not Found
            //         if (!exists || !mimeTypes[ext]) {
            //             console.log({'Файл не найден: ': filePath});
            //             res.writeHead(404, {'Content-Type': 'text/plain'});
            //             res.end('404 Not Found!');
            //             return;
            //         }
            //         // В противном случае отправим ответ со статусом 200 OK,
            //         // и добавляем правильный заголовок типа контента
            //         res.writeHead(200, {'Content-Type': mimeTypes[ext]})
            //         // res.setHeader('Content-Type', 'text/css');
            //
            //         // res.write(filePath);
            //         // res.end();
            //         // return;
            //
            //         // Считать файл и передать его в ответ
            //         const fileStream = fs.createReadStream(filePath)
            //         fileStream.pipe(res)
            //     })
            //
            //     // static(filePath, res);
            // }

            // console.log(req.url);
        })

        server.listen(port, host, () => {
            console.log(`Server running at http://${host}:${port}/`);
        })
    }
}

module.exports = new Server()