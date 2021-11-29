// const nunjucks = require('nunjucks');
// const { VIEWS_PATH } = require('../constants')
const { log } = require('../server/bootstrap.js');

const commonController = require('./Common.js');

class Main extends commonController {
    constructor(client) {
        super(client);
        this.params = (client.params === null) ? {} : client.params;
    }

    index() {
        this.nunjucks.configure(this.VIEWS_PATH, { autoescape: true });
        // console.log({ 'this.params': this.params });
        const content = this.nunjucks.render('index.html', this.params);
        return content;
    }

    contacts() {
        this.nunjucks.configure(this.VIEWS_PATH, { autoescape: true });
        const content = this.nunjucks.render('contacts.html', this.params);
        return content;
    }

    // notFound() {
    //     // res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    //     this.client.res.write('<h3>404 NOT FOUND</h3>');
    //     this.client.res.end();
    //
    //     return '404 NOT FOUND';
    // }

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
}

module.exports = Main;