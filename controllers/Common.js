class Common {
    constructor(client) {
        this.client = client;
        this.nunjucks = require('nunjucks');
        this.constants = require('../constants.js');
    }

    notFound(text='404 not found') {
        this.client.res.write(text);
        this.client.res.end();
    }
}

module.exports = Common;