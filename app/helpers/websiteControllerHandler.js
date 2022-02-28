const { WebsiteError } = require('./errorHandler');

module.exports = (controller) => async (req, res, next) => {
    try {
        await controller(req, res, next);
    } catch (err) {
        const websiteError = new WebsiteError(500, err.message);
        next(websiteError);
    }
};
