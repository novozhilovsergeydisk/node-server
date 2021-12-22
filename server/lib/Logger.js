const { AsyncLocalStorage } = require('async_hooks');
const asyncLocalStorage = new AsyncLocalStorage();

class Logger {
    constructor() {
        this.idSeq = 0;
    }

    info() {
        console.log({ 'Logger time': new Date() })
    }

    #logWithId(msg) {
        console.log(msg);

        // const id = asyncLocalStorage.getStore();
        // // console.log(`${id !== undefined ? id + ' | ' + (new Date()) : ''}:`, msg);
        //
        // let endLine = '';
        //
        // if (msg === 'finish') {
        //     endLine = '\n---------------------------------------------------------------------|';
        // }
        //
        // let logInfo = `${id !== undefined ? id : ''} :`;
        // logInfo += msg + ' at ' + new Date().toISOString() + endLine;
        //
        // console.log({ 'logInfo': logInfo });
    }

    run() {
        asyncLocalStorage.run(this.idSeq++, () => {
            this.#logWithId('start');
            // Imagine any chain of async operations here
            setImmediate(() => {
                this.#logWithId('finish');
                // res.end();
            });
        });
    }
}

const logger = new Logger();

module.exports = { logger, asyncLocalStorage };

// const logLevels = {
//     fatal: 0,
//     error: 1,
//     warn: 2,
//     info: 3,
//     debug: 4,
//     trace: 5,
// };