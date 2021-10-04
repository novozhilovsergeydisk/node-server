const http = require('http');
const path = require('path');
const fs = require('fs');
const mimeTypes = require('../constants');
const mainController = require('../controllers/Main.js');
const routes = require('../routes')

class Server {
    start(port, host, route) {
        this.createServer(port, host, route);
    }

    createServer(port, host, route) {
        const server = http.createServer((req, res) => {

            // Создаем правильный путь к файлу, чтобы получить доступ к соответствующим ресурсам
            const filePath = path.join(__dirname, '/src' + req.url);

            // console.log({'req.url': req.url});

            if (req.url == '/favicon.ico') {
                // res.setHeader('Content-Type', 'text/html');
                // res.end('Resourse ' + req.url + ' not found!\n');
            } else {
                const find = route.find(req.url, routes);
                // console.log(find);
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end('<h3>transplant.net</h3>');

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