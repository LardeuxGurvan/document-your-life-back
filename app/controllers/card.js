// const debug = require('debug')('app:cardController');
const cardDataMapper = require('../models/card');
const userDataMapper = require('../models/user');
const { ApiError } = require('../helpers/errorHandler');

module.exports = {

    // function to get card by userId and cardId
    async getCard(req, res) {
        const { cardId } = req.params;
        const card = await cardDataMapper.findByPk(Number(cardId));
        if (!card) {
            throw new ApiError(404, 'Card not found');
        }

        return res.json(card);
    },

    // function create card
    /**
     * @param {String} text
     * @param {String} video
     * @param {String} audio
     * @param {String} image
     * @param {String} moodId
     * @returns Created Card
     */
    async create(req, res) {
        const { userId } = req.params;
        const {
            text,
            video,
            audio,
            image,
            moodId,
        } = req.body;

        // entire card cannot be empty
        if (!text && !video && !audio && !image) {
            throw new ApiError(403, 'At least one medium must be filled');
        }

        // find the last created card by user
        const lastCard = await cardDataMapper.findLatestByUserPk(userId);

        // check if user created card before
        if (!lastCard) {
            const result = await cardDataMapper.create(
                text,
                video,
                audio,
                image,
                Number(moodId),
                Number(userId),
            );
            return res.json(result);
        }

        // Compares current date with the created date of last card created
        const lastCardDate = lastCard.created_at.toISOString().split('T')[0];
        const currentDate = new Date().toISOString().split('T')[0];

        if (lastCardDate === currentDate) {
            throw new ApiError(403, 'card already created today');
        }

        // create card
        const result = await cardDataMapper.create(
            text,
            video,
            audio,
            image,
            Number(moodId),
            Number(userId),
        );
        return res.json(result);
    },

    async getAllElement(req, res) {
        const { userId } = req.params;
        const user = await userDataMapper.findByPk(Number(userId));
        const lastCards = await cardDataMapper.findCardsByUserPk(userId);
        const allCardMood = await cardDataMapper.selectAllCardsMood(userId);
        // Compares current date with the created date of last card created
        const lastCardDate = lastCards[0].created_at.toISOString().split('T')[0];
        const currentDate = new Date().toISOString().split('T')[0];

        if (!lastCardDate === currentDate) {
            res.json({
                userId: user.id,
                userImage: user.image,
                lastCards: lastCards[0],
                mood: allCardMood,
            });
        }
        res.json({
            userId: user.id,
            userImage: user.image,
            lastCards,
            mood: allCardMood,
        });
    },

};
