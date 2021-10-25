class Base {
    constructor(res) {
        this.res = res;
        this.nunjucks = require('nunjucks');
        this.constants = require('../constants');
    }

    write(data = '<h1>test page</h1>', type = 'text/html') {
        // this.res.setHeader('Content-Type', type);
        this.res.write(data);
    }

    header(key = 'Content-Type', type = 'text/html') {
        this.res.setHeader('Content-Type', type);
    }

    end() {
        this.res.end();
    }
}

module.exports = Base;

