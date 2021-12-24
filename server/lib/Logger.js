const { AsyncLocalStorage } = require('async_hooks');
const asyncLocalStorage = new AsyncLocalStorage();
const storage = require('./Storage.js');

console.log({ storage });

class Logger {
    constructor() {
        this.idSeq = 0;
    }

    info() {
        console.log({ 'Logger time': new Date() })
    }

    #logWithId(msg, req=null) {
        const id = asyncLocalStorage.getStore();
        // console.log(`${id !== undefined ? id + ' | ' + (new Date()) : ''}:`, msg);

        let url = '';
        let http_method = '';
        if (req) url = req.url;
        if (req) http_method = req.method;

        let endLine = '';

        if (msg === 'finish') {
            endLine = '\n----------------------------------------------------------------------------------|';
        }

        let logInfo = `${id !== undefined ? id : ''}. `;

        // console.info({ 'zzz': logInfo });

        // const timestamp = new Date().getTime();

        if (url && http_method) {
            logInfo += url.toString() + msg + ' at ' + new Date().toISOString() + endLine;
        } else {
            logInfo += msg + ' at ' + new Date().toISOString() + endLine;
        }

        // logInfo += '' + http_method + ' ' + '' + url + ' - ' + msg + ' at ' + new Date().toISOString() + ' - ' + timestamp.toString() + endLine;

        console.log( logInfo );

        console.log({ 'logInfo': logInfo });
    }

    run(req, res) {
        asyncLocalStorage.run(this.idSeq++, () => {
            this.#logWithId('start', req);
            // console.log(typeof res);
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

/*
const async_hooks = require ('async_hooks');

// Возвращаем идентификатор текущего контекста выполнения.
const eid = async_hooks.executionAsyncId ();

// Возвращаем идентификатор дескриптора, ответственного за запуск обратного вызова
// текущая область выполнения для вызова.
const tid = async_hooks.triggerAsyncId ();

// Создаем новый экземпляр AsyncHook. Все эти обратные вызовы необязательны.
const asyncHook =
    async_hooks.createHook ({инициализация, до, после, уничтожить, обещаниеResolve});

// Разрешить обратный вызов этого экземпляра AsyncHook. Это не подразумевается
// действие после запуска конструктора и должно быть запущено явно для начала
// выполнение обратных вызовов.
asyncHook.enable ();

// Отключаем прослушивание новых асинхронных событий.
asyncHook.disable ();

//
// Следующие обратные вызовы могут быть переданы в createHook ().
//

// init вызывается во время построения объекта. На ресурсе может не быть
// завершение строительства при запуске этого обратного вызова, поэтому все поля
// ресурс, на который ссылается "asyncId", возможно, не был заполнен.
функция init (asyncId, тип, triggerAsyncId, ресурс) {}

// Before вызывается непосредственно перед вызовом обратного вызова ресурса. Это может быть
// вызывается от 0 до N раз для дескрипторов (например, TCPWrap) и будет вызываться ровно 1 раз
// время для запросов (например, FSReqCallback).
функция до (asyncId) {}

// After вызывается сразу после завершения обратного вызова ресурса.
функция после (asyncId) {}

// Уничтожение вызывается при уничтожении ресурса.
функция уничтожить (asyncId) {}

// обещаниеResolve вызывается только для ресурсов обещания, когда
// вызывается функция `resolve`, переданная конструктору` Promise`
// (напрямую или с помощью других средств выполнения обещания).
функция PromiseResolve (asyncId) {}

// const logLevels = {
//     fatal: 0,
//     error: 1,
//     warn: 2,
//     info: 3,
//     debug: 4,
//     trace: 5,
// };
*/