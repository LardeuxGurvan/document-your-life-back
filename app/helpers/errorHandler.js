const ApiError = require('../errors/apiError');
const WebsiteError = require('../errors/websiteError');

const errorHandler = (err, res) => {
    let { statusCode, message } = err;

    if (Number.isNaN(Number(statusCode))) {
        statusCode = 500;
    }

    if (statusCode === 500 && res.app.get('env') !== 'development') {
        message = 'Internal Server Error';
    }
};

module.exports = {
    ApiError,
    WebsiteError,
    errorHandler,
};
