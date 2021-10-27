const Base = require('./Base.js');

class Patient extends Base {
    constructor(res) {
        super(res);
    }

    section() {
        console.log('Форма авторизации');

        return 'section';
    }

    quest_edit_patients() {
        console.log('Ваши измерения и лекарства');

        return 'quest_edit_patients';
    }

    docquest() {
        console.log('Тепловая карта');

        return 'docquest';
    }

    profile() {
        console.log('Профиль пользователя');

        return 'profile';
    }

    after_pat_quest() {
        console.log('Ваша анкета сохранена');

        // logs/26-10-2021\ 16\:53\:48.log

        return 'after_pat_quest';
    }

    emailEdit(params) {
        this.header('Content-Type', 'text/html');

        try {
            this.nunjucks.configure(this.constants.appPath + '/src/views', { autoescape: true });

            const render = this.nunjucks.render('patient-edit.html', params);

            this.write(render);
        } catch(err) {
            console.log({'err': err});
        }

        this.end();

        console.log({ 'text': 'Отправка email пациенту методом get', 'params': params });

        return 'emailPost';
    }

    emailPost(params) {
        this.header('Content-Type', 'text/json');

        if (params) {
            try {
                this.nunjucks.configure(this.constants.appPath + '/src/views', { autoescape: true });

                const render = this.nunjucks.render('patient-edit.html', params);

                this.write(render);
            } catch(err) {
                console.log({'err': err});
            }

            // this.write(params);
        } else {
            this.write('post');
        }

        this.end();

        console.log({ 'text': 'Отправка email пациенту методом post', 'params': params });

        return 'emailPost';
    }

    auth() {
        console.log('auth');

        return 'auth';
    }
}

module.exports = Patient;