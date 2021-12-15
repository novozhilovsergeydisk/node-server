const path = require('path');
const { CONTROLLERS_PATH, SERVER_PATH } = require(path.resolve(__dirname, '../constants.js'));
const { capitalizeFirstLetter, log } = require(SERVER_PATH + '/helpers');

class Controller {
    constructor() {}

    static call(client, handler='', action='', params=null) {
        try {
            client.params = client.params ? client.params : params;
            const requireController = require(CONTROLLERS_PATH + capitalizeFirstLetter(handler) + '.js');
            const controller = new requireController(client);
            return controller[action]();
        } catch(err) {
            log({ 'Error <Controller><call()>': err });
            return false;
        }
    }
}

module.exports = Controller;