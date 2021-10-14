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

    static not_found_404(res) {
        console.log('404 not found');

        res.setHeader('Content-Type', 'text/html');
        res.write('<h1>Error</h1>');
        res.write('<h3>404 NOT FOUND</h3>');
        res.end();

        return '404 not found';
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

module.exports = Main