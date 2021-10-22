const Base = require('./Base.js');

class Auth extends Base {
    constructor(res) {
        super(res);
    }

    index() {
        try {
            this.nunjucks.configure(this.constants.appPath + '/src/views', { autoescape: true });

            const data = {
                'name': 'Лозап+',
                'dose': '1 таблетка'
            };

            const render = this.nunjucks.render('auth.html', { patient: 'Иванов', doctor: 'Новожилов' });

            this.res.setHeader('Content-Type', 'text/html');
            this.res.write(render);
            this.res.end();
        } catch(err) {
            console.log({'err': err});
        }
    }
}

module.exports = Auth;