const path = require('path');
const { CONTROLLERS_PATH, SCRIPTS_PATH } = require(path.resolve(__dirname, '../constants.js'));
const { capitalizeFirstLetter } = require(SCRIPTS_PATH + '/helpers');

class Controller {
    constructor() {}

    static call(client, handler, action, params) {
        try {
            const controllerName = handler;
            const controllerMethod = action;
            console.log(controllerMethod);
            const requireController = (name) => {
                const controller_path = CONTROLLERS_PATH + capitalizeFirstLetter(name) + '.js';

                return require(controller_path);
            };
            const className = requireController(controllerName);
            const controller = new className( client, params );
            controller[controllerMethod]();

            return true;
        } catch(err) {
            console.log({ 'ERROR': err });
            return false;
        }
    }

    static resolve(client) {
        try {
            const controllerName = client.handler;
            const controllerMethod = client.action;
            console.log(controllerMethod);
            const requireController = (name) => {
                const controller_path = CONTROLLERS_PATH + capitalizeFirstLetter(name) + '.js';

                return require(controller_path);
            };
            const className = requireController(controllerName);
            const controller = new className( client, client.params );
            controller[controllerMethod]();

            return true;
        } catch(err) {
            console.log({ 'ERROR': err });
            return false;
        }
    }
}

module.exports = Controller;