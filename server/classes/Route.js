module.exports = class Route {
    routing = {'GET': {
            '/': (client, par) => Aux.callController(client, 'main', 'index', par, {roles: ['user']}),
            '/index': (client, par) => Aux.callController(client, 'main', 'index', par, {roles: ['user', 'admin']}),
            '/index/*': (client, par) => Aux.callController(client, 'main', 'index', par, {roles: ['admin']}),
            '/user': user,
            '/user/patient': () => user.patient,
            '/user/age': () => user.age,
            '/user/*': (client, par) => 'parameter=' + par[0],
            '/*': (client, par) => Aux.statics(client, par)
        }
    };

    types = {
        object: JSON.stringify,
        string: s => s,
        number: n => n + '',
        undefined: () => 'not found',
        function: (fn, par, client) => fn(client, par),
    };

    matching = [];

    constructor(client) {
        this.client = client;
        for (const key in this.routing[client.http_method]) {
            if (key.includes('*')) {

                // log({ 'key.replace()': '^' + key.replace('*', '(.*)') });

                const rx = new RegExp('^' + key.replace('*', '(.*)'));
                const route = this.routing[client.http_method][key];
                this.matching.push([rx, route]);
                delete this.routing[client.http_method][key];
            }
        }
    };

    resolve() {
        // log({ 'this.matching': this.matching });

        let par;
        let route = this.routing['GET'][this.client.req.url];
        const renderObj = {};
        if (!route) {
            for (let i = 0; i < this.matching.length; i++) {
                const rx = this.matching[i];

                par = this.client.req.url.match(rx[0]);

                // log({ 'this.client.req.url': this.client.req.url, 'rx[0]': rx[0], 'par': par });

                if (par) {
                    par.shift();
                    route = rx[1];
                    break;
                }
            }
        }

        // log({ 'route': route });

        const type = typeof route;
        const renderer = this.types[type];
        if (this.client.mimeType === 'text/html; charset=UTF-8') {
            const arr = this.client.req.url.split('/');
            this.client.controller = arr[1] ? arr[1] : 'main';
            this.client.method = arr[2] ? arr[2] : 'index';
        }
        renderObj.client = this.client;
        renderObj.route = route;
        renderObj.renderer = renderer;
        renderObj.intraspectionRendererParams = getFunctionParams(renderer);
        renderObj.par = par;
        // log(renderObj.renderer);
        return renderObj;
    };
}