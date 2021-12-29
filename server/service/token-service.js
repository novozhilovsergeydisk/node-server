const jwt = require('jsonwebtoken');
const { jwt_access_token, jwt_refresh_token } = require('../config.js');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, jwt_access_token, {expiresIn: '30m'});
        const refreshToken = jwt.sign(payload, jwt_refresh_token, {expiresIn: '30d'});
        return { accessToken, refreshToken };
    }
}

module.exports = new TokenService();