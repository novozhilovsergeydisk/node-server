'use strict';

class Router {
    static findRoute(path, routes, method) {

        // return true;

        const pattern =/^\/$|^\/[a-z]+\/[a-z]+\/?$|^\/[a-z]+\/index\/?$|^\/[a-z]+\/show\/\d+$|^\/[a-z]+\/create\/?$|^\/[a-z]+\/edit\/\d+$|^\/[a-z]+\/update\/\d+$|^\/[a-z]+\/store\/?$|^\/[a-z]+\/destroy\/\d+$/g

        // let arr = [];
        //
        // arr.push('/'.match(pattern));
        // arr.push('/foo/index/'.match(pattern));
        // arr.push('/foo/create/'.match(pattern));
        // arr.push('/foo/show/10'.match(pattern));
        // arr.push('/foo/edit/10'.match(pattern));
        // arr.push('/foo/update/10'.match(pattern));
        // arr.push('/foo/store/'.match(pattern));
        // arr.push('/foo/destroy/10/'.match(pattern));

        // arr.push('/'.match(pattern));

        // console.log({ '/patient/auth': '/patient/auth'.match(pattern) });
        //
        // console.log('========================================');

        // console.log({ 'typeof': typeof routes, 'Object.keys(routes)': Object.keys(routes) });

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        let result = false;

        if (path.match(pattern)) {
            console.log(path);
            Object.keys(routes).forEach((route) => {
                const routeArr = route.split('/');
                const pathArr = path.split('/');
                routeArr.shift();
                pathArr.shift();
                const routeLength = routeArr.length;
                const pathLength = pathArr.length;
                let controllerParams = {};
                const objRoute = routes[route];
                const lengthEqual = routeLength === pathLength;
                const methodEqual = objRoute.method === method;

                // console.log(lengthEqual && methodEqual);

                if (lengthEqual && methodEqual) {

                    // console.log({ 'route': route, 'objRoute': objRoute, 'methodRoute': objRoute.method, 'method': method });

                    controllerParams['HTTP_METHOD'] = method;

                    // console.log({ 'route': route, 'objRoute': objRoute, 'methodRoute': objRoute.method, 'method': method });

                    if (pathLength === 1) {
                        controllerParams['controllerName'] = 'Main';
                        controllerParams['methodName'] = 'main';
                        controllerParams['paramName'] = controllerParams['paramValue'] = null;

                        result = controllerParams;
                    } else {
                        if (routeArr[0] === pathArr[0] && routeArr[1] === pathArr[1]) {
                            controllerParams = {
                                name: capitalizeFirstLetter(pathArr[0]),
                                methodName: pathArr[1],
                            }

                            if (routeLength > 2) {
                                controllerParams['paramName'] = routeArr[2].substring(1);
                                controllerParams['paramValue'] = pathArr[2];
                            } else {
                                controllerParams['paramName'] = controllerParams['paramValue'] = '';
                            }

                            // console.log({ 'controllerParams': controllerParams });

                            result = controllerParams;
                        }
                    }
                }

                // console.log({ 'pathArr': pathArr, 'routeArr': routeArr, 'route': route, 'settings': routes[route] });
            });
        } else {

            // return result;
        }

        // console.log('========================================');

        return result;
    }
}

module.exports = Router;