class Base {
    constructor(res) {
        this.res = res;
        this.nunjucks = require('nunjucks');
        this.constants = require('../constants');
    }

    write(data, type = 'text/html') {
        this.res.setHeader('Content-Type', type);
        this.res.write(data);
        this.res.end();
    }
}

module.exports = Base;

