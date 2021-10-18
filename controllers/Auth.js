const nunjucks = require('nunjucks');
const { appPath } = require('../constants');

class Auth {
    constructor(data) {
        this.data = data;
    }

    index(res) {
        try {
            nunjucks.configure(appPath + '/src/views', { autoescape: true });

            const data = {
                'name': 'Лозап+',
                'dose': '1 таблетка'
            };

            const render = nunjucks.render('auth.html', { patient: 'Иванов', doctor: 'Новожилов' });

            res.setHeader('Content-Type', 'text/html');
            res.write(render);
            res.end();
        } catch(err) {
            console.log({'err': err});
        }
    }
}

module.exports = Auth;