const fs = require('fs');
const nunjucks = require('nunjucks');

class Patient {
    constructor() {}

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

    pat_email_edit() {
        console.log('Отправка email пациенту');

        return 'pat_email_edit';
    }

    auth() {
        console.log('auth');

        return 'auth';
    }
}

module.exports = Patient;