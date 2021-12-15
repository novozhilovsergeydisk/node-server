// const UserModel = require('../models/user-model');
const model = require('../classes/Model.js');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service.js');
const db = require('../classes/DB.js');
const { DTOFactory, log } = require('../helpers');

let pg = db.open({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'transplant_net_ru',
    password: 'postgres_12345',
    port: 5432
});

class UserService {
    registration(email, password) {
        return new Promise((resolve) => {
            const sql = 'users u';
            pg
                .select(sql)
                .where({'email': email})
                .fields(['u.id, u.email'])
                .then(candidate => {
                    // log({ candidate });

                    resolve(candidate);
                });
        });
        // model.query(sql, values).then(data => log({ 'data 1': data }));
        // model.query('SELECT NOW() as now').then(data => log({ 'data 2': data }));
    }

    findOne (email) {
        return new Promise();
    }

    create (email) {
        return new Promise();
    }
}

module.exports = new UserService();