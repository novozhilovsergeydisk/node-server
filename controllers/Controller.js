const path = require('path');
const { CONTROLLERS_PATH, SERVER_PATH } = require(path.resolve(__dirname, '../constants.js'));
const { capitalizeFirstLetter, log, getFunctionParams } = require(SERVER_PATH + '/helpers');

class Controller {
    constructor() {}

    static call(client, handler='', action='', params=null) {
        try {
            log({ 'handler': handler, 'action': action });
            // const controllerName = client.controller ? client.controller : handler;
            // const controllerMethod = client.action ? client.action : action;
            client.params = client.params ? client.params : params;
            const requireController = require(CONTROLLERS_PATH + capitalizeFirstLetter(handler) + '.js');
            const controller = new requireController(client);
            return controller[action]();
        } catch(err) {
            console.log({ 'Error <Controller><call()>': err });
            return false;
        }
    }
}

module.exports = Controller;