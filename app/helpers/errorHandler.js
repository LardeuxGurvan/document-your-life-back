const ApiError = require('../errors/apiError');

const errorHandler = (err, res) => {
    let { statusCode, message } = err;

    if (Number.isNaN(Number(statusCode))) {
        statusCode = 500;
    }

    if (statusCode === 500 && res.app.get('env') !== 'development') {
        message = 'Internal Server Error';
    } else {
        res.status(statusCode).json({
            status: 'error',
            statusCode,
            message,
        });
    }
};

module.exports = {
    ApiError,
    errorHandler,
};
