const nunjucks = require('nunjucks');
// const userService = require('../service/user-service.js');
const adminService = require('../service/admin-service.js');
const { DTOFactory, getFunctionParams, log } = require('../helpers.js');
const { VIEWS_PATH } = require('../../constants.js');

nunjucks.configure(VIEWS_PATH, { autoescape: true });

const getService = (name => {

});

const result = getFunctionParams(getService);

// log({ result });
//
// log({ getFunctionParams });

// Handlers
class reportsControllers {
    async clinic(client) {
        const promice = adminService.clinic(client);

        // console.log({ promice });

        return promice;
    }

    async clinicById(client) {
        const data = adminService.clinicById(client.par.value);

        // log({ data });

        data.then(stream => {
            // log( nunjucks.render('index.html', stream) );

            return nunjucks.render('index.html', stream);

            // DTOFactory({ stream: nunjucks.render('index.html', stream) });
        });

        return DTOFactory({ stream: data });

        // return data;
    }
}

const reportsController = new reportsControllers();

module.exports = reportsController;