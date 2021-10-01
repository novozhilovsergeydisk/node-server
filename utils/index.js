const fs = require('fs');

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.ico': 'image/x-icon',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
}

const static = (filePath, res) => {
    const ext = '.css';

    // fs.exists(filePath, function (exists, err) {
    //     // console.log('exists=', exists);
    //
    //     // Если запрошенный ресурс не существует, то ответ: 404 Not Found
    //     if (!exists || !mimeTypes[ext]) {
    //         console.log('Файл не найден: ' + filePath)
    //         res.writeHead(404, {'Content-Type': 'text/plain'})
    //         res.write('404 Not Found!')
    //         res.end()
    //         return
    //     }
    //     // В противном случае отправим ответ со статусом 200 OK,
    //     // и добавляем правильный заголовок типа контента
    //     // res.writeHead(200, {'Content-Type': mimeTypes[ext]})
    //
    //     res.setHeader('Content-Type', 'text/css');
    //     res.end();

        // Считать файл и передать его в ответ
        // const fileStream = fs.createReadStream(filePath)
        // fileStream.pipe(res)
    // })
};



module.exports = static;