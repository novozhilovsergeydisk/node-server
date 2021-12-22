const { VIEWS_PATH } = require('../../constants.js');
const nunjucks = require('nunjucks');


class Common {
    constructor(client) {
        this.client = client;
        this.nunjucks = nunjucks;
        this.VIEWS_PATH = VIEWS_PATH;
    }

    resolve = data => {
        return new Promise(resolve => {
            // console.log({ 'resolve(data)': data });
            resolve(data);
        });
    }

    reject = error => {
        return new Promise(reject => {
            // console.log({ 'reject(error)': error });
            reject(error);
        });
    }

    notFound() {
        this.nunjucks.configure(this.VIEWS_PATH, { autoescape: true });
        const content = this.nunjucks.render('404.html', this.client.params);
        return content;
    }
}

module.exports = Common;