const path = require('path');
const fs = require('fs');
const { DTOFactory, log } = require('../helpers.js');
const { VIEWS_PATH, STATIC_PATH } = require('../../constants.js');
const nunjucks = require('nunjucks');
const userService = require('../service/user-service.js');

// const userService = new UserService();

log({ userService });

nunjucks.configure(VIEWS_PATH, { autoescape: true });

// Demo data
let patients = [
    {
        id: 1,
        fio: 'Иванов Иван'
    },
    {
        id: 2,
        fio: 'Петров Петр'
    },
    {
        id: 3,
        fio: 'Сидоров Андрей'
    }
];

// Handlers
class patientControllers {
    async main() {
        return DTOFactory({ stream: 'main' });
    }
    async refresh() {
        return DTOFactory({ stream: 'refresh' });
    }
    async activate() {
        return DTOFactory({ stream: 'activate' });
    }
    async register() {
        try {
            // const userService = new UserService();
            //
            // log({ userService });

            return DTOFactory({ stream: nunjucks.render('register/index.html', patients) });
        } catch(e) {

        }
    }
    async getAllPatients() {
        const dto = DTOFactory({ stream: nunjucks.render('index.html', patients) });
        // const dto = DTOFactory({ stream: { 'VIEWS_PATH': VIEWS_PATH } });
        log({ dto });
        return dto;
    }
    async getPatient(client) {
        log({ 'client': client.par.name });
        let patient = {};
        if (client.par.value) {
            const id = Number(client.par.value); //Number(req.params.id); // blog ID
            patient = patients.find(patient => patient.id === id);
        }
        log({ patient });
        const dto = DTOFactory({ stream: JSON.stringify(patient) });
        return dto;
    }
    async addPatient() {
        const id = patients.length + 1; // generate new ID
        // return { foo: 'bar' };
        console.log({ id });
        const newPatient = {
            id,
            fio: req.body.fio
        };
        // console.log({ newPatient });
        patients.push(newPatient);
        return newPatient;
    }
    async updatePatient(req, reply) {
        const id = Number(req.params.id)
        patients = patients.map(patient => {
            if (patient.id === id) {
                return {
                    id,
                    fio: req.body.fio
                }
            }
        });
        return {
            id,
            fio: req.body.fio
        };
    }
    async deletePatient(req, reply) {
        const id = Number(req.params.id);
        patients = patients.filter(patient => patient.id !== id);
        return { msg: `Patient with ID ${id} is deleted` };
    }
}

const existFile = (file) => {
    const filePromice = new Promise((resolve, reject) => {
        fs.stat(file, function(err, stats) {
            if (err) {
                reject('File not found');
            } else {
                resolve(stats);
            }
        });
    });

    return filePromice.then(stats => {
        return new Promise(resolve => {
            stats._file = file;

            const dto = DTOFactory({
                status: 'success',
                data: { 'file': file },
            });

            // log({ dto });
            // resolve(dto);

            resolve({ info: 'file ' + file, status: 'success', error: '' });
        });
    }).catch(err => {
        return new Promise(reject => {
            reject({ state: 'read file', info: 'file ' + file, status: 'failed', error: err });
        });
    });
};

const createReadStream = (file, url) => {
    // const { file, name } = client;
    // log({ ' stream(file)': file });

    const promiseStream = new Promise((resolve, reject) => {
        fs.stat(file, (error) => {
            if (error) {
                const error_stream = 'No resource file: ' + url;
                reject(error_stream);
            }
            else {
                const stream = fs.createReadStream(file);
                // log({ 'Served resource file and resolve promise': stream });
                // log(`\n-------------------------------\n`);
                resolve(stream);
            }
        });
    });

    return promiseStream;
}

const serve = (url) => {



    const filePath = path.join(STATIC_PATH, url);
    return Promise.resolve()
        .then(() => {
            return existFile(filePath);
        })
        .then(result => {
            return result.stream = (result.status === 'success') ? createReadStream(filePath, url) : null;
        })
        .catch(err => {
            console.log({ 'Error serve()': err });
        });
};

const staticController = {
    staticContent: async (client) => {
        return DTOFactory({ stream: serve(client.url) });
    }
};

const patientController = new patientControllers();

module.exports = { patients, patientController, staticController };