/**
 * @typedef {object} WebsiteError
 * @property {string} status - Status
 * @property {number} statusCode - HTTP Status code
 * @property {string} message - Error message
 */
module.exports = class WebsiteError extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
};
