const commonController = require('./Common.js');
const userService = require('../server/service/user-service.js');
const { log } = require('../server/helpers');

class Main extends commonController {
    constructor(client) {
        super(client);
        this.params = (client.params === null) ? {} : client.params;
        this.nunjucks.configure(this.VIEWS_PATH, { autoescape: true });
    }

    index() {
        // this.nunjucks.configure(this.VIEWS_PATH, { autoescape: true });
        // console.log({ 'this.params': this.params });
        const content = this.nunjucks.render('index.html', this.params);
        return content;
    }

    contacts() {
        // this.nunjucks.configure(this.VIEWS_PATH, { autoescape: true });
        const content = this.nunjucks.render('contacts/index.html', this.params);
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
            const cursor = userService.registration('doctor@transplant.3558aa3b-72d6-4244-a984-b280db2e4969');
            return cursor.then(data => {
                const html = this.nunjucks.render('register/index.html', this.params);
                return this.resolve(html);
            }).catch(err => {
                return this.reject(err);
            });
        } catch(e) {
            return this.reject(e);
        }
    }

    login() {
        try {
            const content = '<h1>login()</h1>';
            return content;
        } catch(e) {
            const content = e.toString();
            return content;
        }
    }

    logout() {
        try {

        } catch(e) {

        }
    }
}

module.exports = Main;