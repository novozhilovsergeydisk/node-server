const db = require('./DB.js');

const pg = db.open({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'transplant_net_ru',
    password: 'postgres_12345',
    port: 5432
});

class Model {
    constructor(pool) {
        this.pool = pool;
        this.select_ = null;
        this.where_ = null;
        this.fields_ = [];
        this.order_ = null;
    }

    select(text) {
        this.select_ = text;
        return this;
    }

    where(text) {
        this.where_ = text;
        return this;
    }

    fields(text) {
        this.fields_ = text;
        return this;
    }

    order(text) {
        this.order_ = text;
        return this;
    }

    run() {
        return new Promise((resolve) => {
            pg
                .select(this.select_)
                .where(this.where_)
                .fields(this.fields_)
                .order(this.order_)
                .then((rows) => {
                    resolve(rows);
                });
        });
    }

    save() {
        return new Promise((resolve) => {
            pg.query('insert into users values(nextval(\'users_id_seq\'), $1, $2, $3)', ['patient@transplant.' + uuid.v4(), uuid.v4(), false], cb);
        });
    }

    query = (sql, values) => {
        return new Promise((resolve, reject) => {
            try {
                const res = this.pool.query(sql, values);
                resolve(res);
            } catch (err) {
                reject(err);
                console.log({ 'error stack': err.stack });
            }
        });
    };
}

module.exports = new Model(pg.pool);