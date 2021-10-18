'use strict';

class Router {
    static findRoute(path, routes, http_method) {

        // return true;

        /*const pattern =/^\/$|^\/[a-z]+\/[a-z]+\/?$|^\/[a-z]+\/index\/?$|^\/[a-z]+\/show\/\d+$|^\/[a-z]+\/create\/?$|^\/[a-z]+\/edit\/\d+$|^\/[a-z]+\/update\/\d+$|^\/[a-z]+\/store\/?$|^\/[a-z]+\/destroy\/\d+$/g*/


        const pattern =/^\/$|^\/[a-z_]+\/[a-z_]+\/?$|^\/$|^\/[a-z_]+\/[a-z_]+\/\d+$/g

        // let arr = [];
        //
        // arr.push('/'.match(pattern));

        // console.log({ '/patient/auth': '/patient/auth'.match(pattern) });
        //
        // console.log('========================================');

        // console.log({ 'typeof': typeof routes, 'Object.keys(routes)': Object.keys(routes) });

        // Router.prototype.capitalizeFirstLetter = ((string) => {
        //     return string.charAt(0).toUpperCase() + string.slice(1);
        // });

        let result = false;

        if (path.match(pattern)) {
            // console.log({ 'path': path, 'routes': routes.get });

            // console.log(routes.get);

            if (http_method === 'GET') {
                Object.keys(routes.get).forEach((route) => {
                    // console.log({ 'path': path, 'route': route + '/' });

                    if (path === route || path === route + '/') {
                        // console.log({ 'path': path, 'handler': routes.get[route].handler });
                        // console.log({ 'route': route, 'action': routes.get[route].action });

                        result = {'handler': routes.get[route].handler, 'action': routes.get[route].action};
                    }
                });
            }

            if (http_method === 'POST') {
                Object.keys(routes.post).forEach((route) => {
                    if (path === route || path === route + '/') {
                        // console.log({ 'path': path, 'handler': routes.post[route].handler });
                        // console.log({ 'route': route, 'action': routes.post[route].action });

                        result = {'handler': routes.post[route].handler, 'action': routes.post[route].action};
                    }
                });
            }
        }

        return result;
    }
}

module.exports = Router;