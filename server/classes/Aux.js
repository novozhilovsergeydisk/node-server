

module.exports = class Aux {
    static setHeader = client => {
        client.res.setHeader('Platform-Type', 'SmartJS');
        client.res.setHeader('Content-Type', client.mimeType);
    }

    static callController = (client, controllerName='main', action='index', data=null, roles=null) => {
        log({ 'controllerName': controllerName, 'action': action });
        log(roles);

        // controllerName = (client.controller) ? client.controller : controllerName;
        action = (client.action) ? client.action : action;
        const prom = new Promise((resolve) => {
            log({ 'controllerName 2': controllerName, 'action 2': action });

            resolve(controller.call(client, controllerName, action, data));
        });
        return prom.then(data => {
            return new Promise(resolve => {
                const entries = {
                    state: 'call controller',
                    info: 'controller' + controllerName,
                    status: 'success',
                    error: '',
                    stream: data
                };
                resolve(entries);
            });
        }).catch(err => {
            return new Promise(reject => {
                const entries = {
                    state: 'call controller',
                    info: 'controller' + controllerName,
                    status: 'failed',
                    error: err,
                    stream: null
                };
                reject(entries);
            });
        });
    };

    static statics = client => {
        // log(client);

        const prom = new Promise((resolve) => resolve(new Files().serve(client)));
        return prom.then(stream => {
            // if (stream.status === 'failed') {
            //     // stream.stream = this.callController(client, 'main', 'notFound');
            // }

            return stream;
        }).catch(error_stream => {
            console.log({ 'Error stream': error_stream });
            return null;
        });
    };

    static render = fn => {
        return fn.renderer(fn.route, fn.par, fn.client)
    }

    static execute = client => {
        return Promise.resolve()
            .then(() => {
                return new Route(client).resolve();
            })
            .then(fn => {
                // log({ 'fn': fn });
                return this.render(fn);
            })
            .then(content => {
                return {
                    content: content,
                    data: {
                        patient: 'Иванов И.И.',
                        doctor: 'Новожилов С.Ю.'
                    }
                }
            })
            .catch(err => {
                console.log({ 'Error while execute': err });
                return null;
            });
    }

    static send = (entries, client) => {
        const content = entries.content['stream'];
        if (client.mimeType === 'text/html; charset=UTF-8') {
            this.setHeader(client);
            if (content === null || content === undefined) {
                client.res.end('404 not found');
            } else {
                client.res.end(content);
            }
        } else {
            if (content instanceof Promise) {
                this.setHeader(client);
                // log({ 'content instanceof Promise': content instanceof Promise });
                // log({ 'client.mimeType': client.mimeType, 'entries': entries });
                content.then(stream => {
                    // log({ 'stream': stream });
                    // return stream;
                    if (stream) {
                        this.setHeader(client);
                        // log({ 'stream@': client.req.url });
                        // console.log({ 'stream': stream });
                        stream.pipe(client.res);
                        // res.end();
                    }
                }).catch(error_stream => {
                    console.log({ 'Error stream in send': error_stream });
                });
            } else {
                client.res.setHeader('Content-Type', 'text/html; charset=UTF-8');
                client.res.write('<h3>404 not found!</h3>');
                client.res.end('<h5>' + client.mimeType + '</h5>');
                log({ 'content instanceof Promise': content instanceof Promise });
            }
        }
        // log('\n-----------------------------\n');
    };
}