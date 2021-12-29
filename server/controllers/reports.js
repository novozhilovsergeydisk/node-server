const nunjucks = require('nunjucks');
// const userService = require('../service/user-service.js');
const adminService = require('../service/admin-service.js');
const { DTOFactory, getFunctionParams, log } = require('../helpers.js');
const { VIEWS_PATH } = require('../../constants.js');

nunjucks.configure(VIEWS_PATH, { autoescape: true });

// Handlers
class reportsControllers {
    async clinic(client) {
        const promice = adminService.clinic(client);
        return promice;
    }

    async clinicById(client) {
        const data = adminService.clinicById(client.par.value);

        const list =
        [
            { id: 62, name: 'ГБУЗ "НИИ-ККБ№1 им.проф.С.В.Очаповского" г.Краснодар', reg_time: '2019-07-08 23:40:48' },
            { id: 68, name:	'ГКБ 52', reg_time: '2019-08-28 15:37:39' },
            { id: 64, name:	'Клиника МОНИКИ', reg_time: '2019-07-08 23:48:39' },
            { id: 73, name:	'Красноярская краевая больница', reg_time: '2020-10-29 11:46:42' },
            { id: 69, name:	'НИИ им. Алмазова', reg_time: '2020-01-15 10:52:24' },
            { id: 72, name:	'Российская детская клиническая больница им. Н.И. Пирогова', reg_time: '2020-04-15 11:12:16' },
            { id: 71, name:	'Самарский государственный медицинский университет', reg_time: '2020-02-06 14:15:49' },
            { id: 67, name:	'ФГБУ ФКЦ ВМТ ФМБА России', reg_time: '2019-08-11 13:17:39' },
            { id: 63, name:	'ФНЦ трансплантологии им ВИ Шумакова', reg_time: '2019-07-08 23:43:38' },
            { id: 74, name:	'Хабаровское отделение нефрологии', reg_time: '2020-10-29 11:47:49' },
            { id: 70, name:	'Центр трансплантации печени Института Склифосовского', reg_time: '2020-02-05 10:09:41' }
        ];

        const stream = data.then(clinics => {
           // log({ clinics });

           const patients = [{ title: "Иванов", id: 1 }, { title: "Козлов", id: 2}, { title: "Гришин", id: 3}];

           return nunjucks.render('reports/index.html', { patients: patients, clinics: list });

            // DTOFactory({ stream: nunjucks.render('index.html', stream) });
        });

        const dto = DTOFactory({ stream: stream });

        // log({ dto });

        return dto;

        // return data;
    }
}

const reportsController = new reportsControllers();

module.exports = reportsController;