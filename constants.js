const path = require('path');

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.ico': 'image/x-icon',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

const appPath = path.resolve(__dirname);

const CONSTANTS = {
    MIME_TYPES: mimeTypes,
    APP_PATH: appPath,
    SERVER_PATH: appPath + '/server',
    RESOURCES_PATH: appPath + '/src',
    VIEWS_PATH: appPath + '/src/views',
    CONTROLLERS_PATH: appPath + '/controllers/',
    STATIC_PATH: path.join(appPath, './static')
}

module.exports = CONSTANTS;