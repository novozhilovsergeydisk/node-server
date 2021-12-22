const { CONTROLLERS_PATH, SERVER_PATH } = require('../../constants.js');
console.log({ 'SERVER_PATH': SERVER_PATH });
const { capitalizeFirstLetter, log } = require(SERVER_PATH + '/helpers.js');

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