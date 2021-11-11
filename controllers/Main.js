// const nunjucks = require('nunjucks');
// const { VIEWS_PATH } = require('../constants')

const commonController = require('./Common.js');

class Main extends commonController {
    constructor(client, params) {
        super(client);

        this.req = client.req;
        this.res = client.res;

        if (params === null) {
            this.params = {};
        } else {
            this.params = params;
        }
    }

    index() {
        this.res.setHeader('Content-Type', 'text/html');
        // this.params = { title: 'Transplant.net', foo: 'bar', items: { rapsberry: 'Microsoft', chrome: 'Google' } };
        this.nunjucks.configure(this.constants.VIEWS_PATH, { autoescape: true });
        const render = this.nunjucks.render('index.html', this.params);
        this.res.write(render);
        this.res.end('');

        return 'index';
    }

    // static success(body='200 OK') {
    //     this.res.setHeader('Content-Type', 'text/html');
    //     this.res.write(body);
    //     this.res.end();
    //
    //     return body;
    // }
    //
    // static internal_error_500() {
    //     this.res.setHeader('Content-Type', 'text/html');
    //     this.res.write('500 INTERNAL SERVER ERROR');
    //     this.res.end();
    //
    //     return '500 INTERNAL SERVER ERROR';
    // }
    //
    // static bad_request_400(res) {
    //     res.setHeader('Content-Type', 'text/html');
    //     res.write('400 BAD REQUEST');
    //     res.end();
    //
    //     return '400 BAD REQUEST';
    // }
    //
    // static not_found_404() {
    //     console.log({ '404': 'NOT FOUND', 'res.url': req.url });
    //
    //     res.setHeader('Content-Type', 'text/html');
    //     // res.write('<h1>Error</h1>');
    //     res.write('<h1>'+req.url+'</h1>');
    //     res.write('<h3>404 NOT FOUND</h3>');
    //     res.end();
    //
    //     return '404 NOT FOUND';
    // }
}

module.exports = Main;