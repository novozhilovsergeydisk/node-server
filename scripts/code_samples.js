// ----------- 1 ------------

console.log({ 'f':  });

// ----------- 2 ------------

try {
    //
} catch(err) {
    console.log({'err': err});
}

// ----------- 3 ------------

class TestController {
    constructor(data) {
        this.data = data;
    }

    index() {

    }

    static staticFinction() {

    }

}

// ----------- 4 ------------

class RestController {
    constructor() {}

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