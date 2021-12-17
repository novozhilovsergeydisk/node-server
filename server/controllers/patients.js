const path = require('path');
const fs = require('fs');
const { DTOFactory, log } = require('../helpers.js');
const { APP_PATH, STATIC_PATH } = require('../../constants.js');
const nunjucks = require('nunjucks');

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
                // log(`Served resource file and resolve promise: ${name}`);
                // log(`\n-------------------------------\n`);
                resolve(stream);
            }
        });
    });

    return promiseStream;
}

const serve = (url) => {
    // const { name } = client;
    const filePath = path.join(STATIC_PATH, url);
    return Promise.resolve()
        .then(() => {
            return existFile(filePath);
        })
        .then(result => {
            if (result.status === 'success') {
                // client.file = filePath;
                result.stream = createReadStream(filePath, url) // this.stream(client);
            }
            if (result.status === 'failed') {
                result.stream = null;
                return result;
            }
            // log({ 'serve()': result });
            return result;
        })
        .catch(err => {
            console.log({ 'Error while streaming process': err });
        });
};

const staticController = {
    staticContent: async (par) => {
        log({ 'staticController par': par })

        const staticPromice = new Promise((resolve) => resolve(serve(par.name)));

        log({ staticPromice });

        staticPromice.then(stream => {
            log({ stream });
        });

        return DTOFactory({ stream: staticPromice });
    }
};

// Handlers
const patientControllers = {
    getAllPatients: async () => {
        return DTOFactory({ stream: JSON.stringify(patients) });
    },
    getPatient: async (req, par) => {
        log({ 'req.params': req.params });
        const id = Number(par.value); //Number(req.params.id); // blog ID
        // log(typeof id);
        const patient = patients.find(patient => patient.id === id);

        log({ patient });

        // log({ req });
        // log({ par });
        // log(par.value);

        const dto = DTOFactory({
            stream: JSON.stringify(patient)
        });

        return dto;

        // return patient;
    },
    addPatient: async (req, reply) => {
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
    },
    updatePatient: async (req, reply) => {
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
    },
    deletePatient: async (req, reply) => {
        const id = Number(req.params.id);
        patients = patients.filter(patient => patient.id !== id);
        return { msg: `Patient with ID ${id} is deleted` };
    }
};

module.exports = { patients, patientControllers, staticController };

// const routes = [
//     {
//         method: 'GET',
//         url: '/api/patients',
//         handler: patientController.getAllPatients
//     },
//     {
//         method: 'GET',
//         url: '/api/patients/:id',
//         handler: patientController.getPatient
//     },
//     {
//         method: 'POST',
//         url: '/api/patients',
//         handler: patientController.addPatient
//     },
//     {
//         method: 'PUT',
//         url: '/api/patients/:id',
//         handler: patientController.updatePatient
//     },
//     {
//         method: 'DELETE',
//         url: '/api/patients/:id',
//         handler: patientController.deletePatient
//     }
// ];