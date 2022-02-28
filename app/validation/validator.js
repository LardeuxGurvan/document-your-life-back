const { ApiError } = require('../helpers/errorHandler');

module.exports = (prop, schema) => async (request, _, next) => {
    try {
        console.log(request[prop]);
        await schema.validateAsync(request[prop]);
        next();
    } catch (error) {
        next(new ApiError(400, error.details[0].message));
    }
};
