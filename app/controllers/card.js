const debug = require('debug')('app:createCard');
const cardDataMapper = require('../models/card');
const { ApiError } = require('../helpers/errorHandler');

module.exports = {

    async getCard(req, res) {
        const { userId, cardId } = req.params;
        const card = await cardDataMapper.findByPk(Number(userId), Number(cardId));
        if (!card) {
            throw new ApiError(404, 'Card not found');
        }

        return res.json(card);
    },

    async create(req, res) {
        const { userId } = req.params;
        const {
            text,
            video,
            audio,
            image,
        } = req.body;
        const currentDate = Date.now();
        debug(currentDate);
        // const card = await cardDataMapper.findByDateAndUser()
        const result = await cardDataMapper.create(text, video, audio, image, userId);
        return res.json(result);
    },

};
