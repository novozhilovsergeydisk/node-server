const Base = require('./Base.js');

class Patient extends Base {
    constructor(res) {
        super(res);
    }

    _write(data, type = 'text/html') {
        this.res.setHeader('Content-Type', type);
        this.res.write(data);


        this.res.end();
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

        return 'after_pat_quest';
    }

    pat_email_edit(params) {
        this.write('write(): status 200');

        console.log('Отправка email пациенту');

        return 'pat_email_edit';
    }

    auth() {
        console.log('auth');

        return 'auth';
    }
}

module.exports = Patient;