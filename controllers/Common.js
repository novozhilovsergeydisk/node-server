const { SERVER_PATH, VIEWS_PATH } = require('../constants.js');
const nunjucks = require('nunjucks');
// const { log } = require(SERVER_PATH + '/helpers');

class Common {
    constructor(client) {
        this.client = client;
        this.nunjucks = nunjucks;
        this.VIEWS_PATH = VIEWS_PATH;
    }

    notFound(text='404 not found') {
        this.nunjucks.configure(this.VIEWS_PATH, { autoescape: true });
        // log({ 'this.client.params': this.client.params });
        const content = this.nunjucks.render('404.html', this.client.params);
        return content;
    }
}

module.exports = Common;