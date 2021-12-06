// const { log } = require('../server/bootstrap.js');

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

    test() {
        const content = '<h1>test()</h1>h1>';
        return content;
    }

    activate() {
        try {

        } catch(e) {

        }
    }

    refresh() {
        try {

        } catch(e) {

        }
    }

    users() {
        try {
            const content = '<h1>users()</h1>';
            return content;
        } catch(e) {

        }
    }

    registration() {
        try {

        } catch(e) {

        }
    }

    login() {
        try {
            const content = '<h1>login()</h1>';
            return content;
        } catch(e) {

        }
    }

    logout() {
        try {

        } catch(e) {

        }
    }
}

module.exports = Main;