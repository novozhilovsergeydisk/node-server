const fs = require('fs');
const nunjucks = require('nunjucks');

class Main {
    constructor(data) {
       this.data = data;
    }

    index() {
        console.log('index');

        return 'index';
    }

    static success(res, body) {
        res.setHeader('Content-Type', 'text/html');
        res.write(body);
        res.end();

        return '404 NOT FOUND';
    }

    static internal_error_500(res) {
        console.log({ '500': 'INTERNAL SERVER ERROR' });

        res.setHeader('Content-Type', 'text/html');
        // res.write('<h1>Error</h1>');
        res.write('<h3>500 INTERNAL SERVER ERROR</h3>');
        res.end();

        return '500 INTERNAL SERVER ERROR';
    }

    static bad_request_400(res) {
        console.log({ '400': 'BAD REQUEST' });

        res.setHeader('Content-Type', 'text/html');
        // res.write('<h1>Error</h1>');
        res.write('<h3>400 BAD REQUEST</h3>');
        res.end();

        return '400 BAD REQUEST';
    }

    static not_found_404(res) {
        console.log({ '404': 'NOT FOUND' });

        res.setHeader('Content-Type', 'text/html');
        // res.write('<h1>Error</h1>');
        res.write('<h3>404 NOT FOUND</h3>');
        res.end();

        return '404 NOT FOUND';
    }

    // test() {
    //     console.log(__dirname);
    //
    //     nunjucks.configure(__dirname + '/../src/views', { autoescape: true });
    //
    //     const m = {
    //         'name': 'Лозап+',
    //         'dose': '1 таблетка'
    //     };
    //
    //     const render = nunjucks.render('test.html', { patient: 'Иванов', 'doctor': 'Новожилов' });
    //
    //     // console.log(render);
    //     //
    //     // const myReadStream = fs.createReadStream(__dirname + '/../src/views/test.html', 'utf8');
    //     // myReadStream.pipe(res);
    //
    //     return render;
    // }
}

module.exports = Main;