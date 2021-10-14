const fs = require('fs');
const nunjucks = require('nunjucks');

class Foo {
    constructor() {}

    main() {
        console.log('main');
    }

    index() {
        // console.log('index');

        return 'index';
    }

    show() {
        // console.log('show');

        return 'show';
    }

    create() {
        // console.log('create');

        return 'create';
    }

    edit() {
        // console.log('edit');

        return 'edit';
    }

    update() {
        // console.log('update');

        return 'update';
    }

    store() {
        // console.log('store');

        return 'store';
    }

    destroy() {
        // console.log('destroy');

        return 'destroy';
    }
}

module.exports = Foo;