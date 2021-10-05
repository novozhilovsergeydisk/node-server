'use strict';

class Router {
    static find(path, routes) {
        let pattern = new RegExp('\:(.*)');

        for (let route in routes) {
            console.log({'patern': pattern, 'routes': routes, 'route.match(pattern)': route.match(pattern)});

            if (route.match(pattern)) {

                console.log({'route': route, 'path': path});

                route = route.split('/');
                path = path.split('/');

                // console.log({'route': route, 'path': path});

                if (route.length === path.length) {
                    let parameters = [];

                    for (let i = 0; i < route.length; i++) {
                        // parameters[route[i]] =

                        if (route[i].match(pattern)) {

                            // console.log({'route[i].match(pattern)': route[i].match(pattern)});

                            parameters[route[i].match(pattern).pop()] = path[i];

                            // console.log({'route[i]':route[i], 'parameters': parameters, 'path[i]': path[i]})
                        } else if (route[i] === path[i]) {
                            continue;
                        } else {
                            break;
                        }
                    }

                    if (Object.keys(parameters).length) {
                        const data = {
                            controller: routes[route.join('/')],
                            params: parameters
                        }

                        console.log({'parameters': parameters, 'Object.keys(parameters).length': Object.keys(parameters).length, 'data': data})

                        return data;
                    }
                }
            } else if (path === route) {
                return {
                    route: routes[route]
                }
            }
        }

        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');

        // return false;
    }
}

module.exports = Router;