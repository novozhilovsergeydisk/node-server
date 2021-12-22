'use strict'

const fs = require('fs');
const path = require('path');
const { STATIC_PATH } = require('../../constants.js');
// const db = require(APP_PATH + '/server/classes/DB');
const { DTOFactory } = require('../helpers');
// const mime = require('mime');


class Files {
    serve(client) {
        const { name } = client;
        const filePath = path.join(STATIC_PATH, name);
        return Promise.resolve()
            .then(() => {
                return this.exists(filePath)
            })
            .then(result => {
                if (result.status === 'success') {
                    client.file = filePath;
                    result.stream = this.stream(client);
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

    stream(client) {
        const { file, name } = client;
        // log({ ' stream(file)': file });

        const promiseStream = new Promise((resolve, reject) => {
            fs.stat(file, (error) => {
                if (error) {
                    const error_stream = 'No resource file: ' + client.req.url;
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

    exists(file) {
        const prom = new Promise((resolve, reject) => {
            fs.stat(file, function(err, stats) {
                if (err) {
                    reject('File not found');
                } else {
                    resolve(stats);
                }
            });
        });

        return prom.then(stats => {
            return new Promise(resolve => {
                stats._file = file;

                const dto = DTOFactory({
                    status: 'success',
                    data: { 'file': file },
                });
                // log({ dto });
                // resolve(dto);

                resolve({ state: 'read file', info: 'file ' + file, status: 'success', error: '' });
            });
        }).catch(err => {
            return new Promise(reject => {
                reject({ state: 'read file', info: 'file ' + file, status: 'failed', error: err });
            });
        });
    }
}

module.exports = Files;