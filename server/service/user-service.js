// const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

class UserService {
    async registration(email, password) {
        const candidate = await this.findOne({ email });
        if (candidate) {
           throw new Error(`Пользователь с почтовым адресом ${email} уже существует`)ж
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const user = await this.create({ email, password: hashPassword, activationLink });
    }

    findOne (email) {
        return new Promise();
    }

    create (email) {
        return new Promise();
    }
}

module.exports = new UserService();