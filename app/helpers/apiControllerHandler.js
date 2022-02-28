const { ApiError } = require('./errorHandler');

module.exports = (controller) => async (req, res, next) => {
    try {
        await controller(req, res, next);
    } catch (err) {
        const apiError = new ApiError(err.statusCode, err.message);
        next(apiError);
    }
};
