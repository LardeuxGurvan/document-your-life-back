const Joi = require('joi');

module.exports = Joi.object({
    label: Joi.string(),
    user_id: Joi.number().integer().required(),
});
