const Joi = require('joi');

module.exports = Joi.object({
    text: Joi.string(),
    video: Joi.string(),
    audio: Joi.string(),
    image: Joi.string(),
    user_id: Joi.number().integer().required(),
    mood_id: Joi.number().integer().required(),

});
