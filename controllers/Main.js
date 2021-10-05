const fs = require('fs');
const nunjucks = require('nunjucks');

class Main {
    constructor() {}

    foo(res) {
        console.log(__dirname);
    }

    index(res) {
        console.log(__dirname);

        nunjucks.configure(__dirname + '/../src/views', { autoescape: true });

        const food = {
            'ketchup': '5 tbsp',
            'mustard': '1 tbsp',
            'pickle': '0 tbsp'
        };

        const render = nunjucks.render('test.html', { foo: 'bar', 'food': food });

        // console.log(render);
        //
        // const myReadStream = fs.createReadStream(__dirname + '/../src/views/test.html', 'utf8');
        // myReadStream.pipe(res);

        return render;
    }
}

module.exports = new Main() // {'index': 'foo'};