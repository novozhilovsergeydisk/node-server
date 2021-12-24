const { database } = require('../config.js');
const db = require('../lib/DB');
const { DTOFactory, log } = require('../helpers');

const pg = db.open( database );

// log({ DTOFactory });

class AdminService {
    constructor() {}

    clinic(client) {
        log({ client });

        const sql = 'cabinet c';
        const re = pg
            .select(sql)
            .where({'id': `<=59`})
            // .fields(['u.id, u.email'])
            .then(data => {
                log({ data });

                // resolve(data);
            });

        log({ re });

        const dto = DTOFactory({ stream: 'AdminService' });
        // log( DTOFactory );
        return { stream: 'AdminService' };
    }

    clinicById(id) {
        try {
            const clinicList = new Promise((resolve) => {
                const sql = 'cabinet c';
                const re = pg
                    .select(sql)
                    .where({'id': `${id}`})
                    // .fields(['u.id, u.email'])
                    .then(result => {
                        // log({ result });
                        // resolve(DTOFactory({ stream: result }));

                        resolve( result );
                    });

            });

            // log(typeof clinicList);

            return clinicList;
        } catch(e) {
            log({ e });
            return { error: e };
        }
    }
}

module.exports = new AdminService();