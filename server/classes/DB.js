const { Pool } = require('pg');

// 'SELECT $1::text as name', ['transplant.net']
class DB {
    constructor() {
        this.pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'transplant_net_ru',
            password: 'postgres_12345',
            port: 5432,
        });
    }

    query(sql, params=null) {
        const pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'transplant_net_ru',
            password: 'postgres_12345',
            port: 5432,
        });
        const promice = new Promise((resolve, reject) => {
            pool
                .query(sql, params)
                .then(res => {
                    resolve({ 'result': res.rows, 'error': null });
                })
                .catch(err => {
                    reject({ 'result': 'undefined', 'error': err.stack });
                });
        });
        return promice.then(data => {
            if (data) console.log(data);
        }).catch(err => {
            if (err) console.log({ 'err': err });
        });
    }
}

module.exports = DB;