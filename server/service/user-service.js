// const UserModel = require('../models/user-model');
const model = require('../lib/Model.js');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service.js');
const db = require('../lib/DB.js');
const { DTOFactory, log } = require('../helpers');

const pg = db.open({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'transplant_net_ru',
    password: 'postgres_12345',
    port: 5432
});

class UserService {
    constructor() {}

    cabinet(client) {
        // log({ 'client.url': client.url });

        // const parName = client.par.name;
        //
        // if (parName === 'id') {
        //
        // }

        //userService.cabinet(59);
        return DTOFactory({stream: 'cabinetControllers'});

        // const cabinetList = new Promise((resolve) => {
        //     const sql = 'cabinet c';
        //     pg
        //         .select(sql)
        //         .where({'id': id})
        //         // .fields(['u.id, u.email'])
        //         .order('id')
        //         .then(data => {
        //             log({ data });
        //
        //             resolve(data);
        //         });
        // });
        //
        // return cabinetList;
    }

    async register(email, password) {
        const candidate = new Promise((resolve) => {
            const sql = 'users u';
            pg
                .select(sql)
                .where({'email': email})
                .fields(['u.id, u.email'])
                .then(data => {
                    // log({ data });

                    resolve(data);
                });
        });

        if (candidate) {
            throw new Error('пользователь с таким email ужк существует')
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const user = await model.create({ email, password: hashPassword, activationLink });
        await mailService.sendActivationMail(email, activationLink);
        return candidate;
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