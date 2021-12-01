const path = require('path');
const { CONTROLLERS_PATH, SERVER_PATH } = require(path.resolve(__dirname, '../constants.js'));
const { capitalizeFirstLetter, log, getFunctionParams } = require(SERVER_PATH + '/helpers');

class Controller {
    constructor() {}

    static call(client, handler='', action='', params=null) {
        try {
            // log({ 'handler': handler, 'action': action });
            const controllerName = client.controller ? client.controller : handler;
            // log({ 'controllerName': controllerName });
            const controllerMethod = client.action ? client.action : action;
            client.params = client.params ? client.params : params;

            const requireController = require(CONTROLLERS_PATH + capitalizeFirstLetter(handler) + '.js');

            // log({ 'handler': handler, 'controllerName': controllerName, 'requireController': requireController });

            // const requireController = (name) => {
            //     log({ 'name': name });
            //     require(CONTROLLERS_PATH + capitalizeFirstLetter(name) + '.js');
            // }

            // const className = requireController(handler);
            const controller = new requireController(client);
            return controller[controllerMethod]();
        } catch(err) {
            console.log({ 'Error controller call': err });
            return false;
        }
    }
}

module.exports = Controller;