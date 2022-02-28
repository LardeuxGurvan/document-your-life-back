const Joi = require('joi');

module.exports = Joi.object({
    label: Joi.string().required(),
    color: Joi.string().required(),
});
