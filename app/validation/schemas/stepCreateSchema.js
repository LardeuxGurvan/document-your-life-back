const Joi = require('joi');

module.exports = Joi.object({
    label: Joi.string().required(),
    result: Joi.boolean().falsy('N').required(),
    comment: Joi.string(),
    goal_id: Joi.number().integer().required(),
});
