/* eslint-disable consistent-return */
const debug = require('debug')('app:cardController');
const { getStorage, ref, deleteObject } = require('firebase/storage');
const cardDataMapper = require('../models/card');
const userDataMapper = require('../models/user');
const { ApiError } = require('../helpers/errorHandler');

// init firebase for delete

module.exports = {

    // function to get card by userId and cardId
    async getCard(req, res) {
        const { cardId } = req.params;
        const card = await cardDataMapper.findByPk(Number(cardId));
        if (!card) {
            throw new ApiError(404, 'Card not found');
        }
        card.dateString = card.created_at.toLocaleString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            year: 'numeric',
            month: 'long',
        });

        return res.json({
            card,
        });
    },

    // function to get dashboard elements
    async getAllElements(req, res) {
        const { userId } = req.params;
        const text = null;
        const video = null;
        const audio = null;
        const image = null;
        const moodLabel = null;
        const dateStringFunction = (date) => date.toLocaleString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            year: 'numeric',
            month: 'long',
        });
        const user = await userDataMapper.findByPk(Number(userId));
        if (!user) {
            throw new ApiError(404, 'User not found');
        } else {
            const lastCards = await cardDataMapper.findCardsByUserPk(userId);

            // User created card
            if (lastCards) {
                // Get all cards
                const allCardMood = await cardDataMapper.selectAllCardsMood(userId);

                // Compares current date with the created date of last card created
                const lastCardDate = lastCards[0].created_at.toISOString().split('T')[0];
                const currentDate = new Date().toISOString().split('T')[0];

                // Give different date format
                lastCards[0].dateString = dateStringFunction(lastCards[0].created_at);

                // Case there is only one card
                if (lastCards.length < 2) {
                    // And this is the daily card
                    if (lastCardDate === currentDate) {
                        res.json({
                            userId: user.id,
                            userImage: user.image,
                            lastCards,
                            calendarMoods: allCardMood,
                        });
                    } else {
                        const result = await cardDataMapper.create(
                            text,
                            video,
                            audio,
                            image,
                            moodLabel,
                            Number(userId),
                        );
                        result.moodLabel = 'neutral';
                        result.dateString = dateStringFunction(result.created_at);
                        const todayMood = {
                            id: result.id,
                            user_id: user.id,
                            label: 'neutral',
                            created_at: result.created_at,
                        };
                        res.json({
                            userId: user.id,
                            userImage: user.image,
                            lastCards: [result, lastCards[0]],
                            calendarMoods: [todayMood,
                                allCardMood[0],
                            ],
                        });
                    }
                } else if (lastCardDate === currentDate) {
                    lastCards[1].dateString = dateStringFunction(lastCards[1].created_at);
                    res.json({
                        userId: user.id,
                        userImage: user.image,
                        lastCards,
                        calendarMoods: allCardMood,
                    });
                } else {
                    const result = await cardDataMapper.create(
                        text,
                        video,
                        audio,
                        image,
                        moodLabel,
                        Number(userId),
                    );
                    result.moodLabel = 'neutral';
                    result.dateString = dateStringFunction(result.created_at);
                    const todayMood = {
                        id: result.id,
                        user_id: user.id,
                        label: 'neutral',
                        created_at: result.created_at,
                    };
                    allCardMood.splice(0, 0, todayMood);
                    allCardMood.join();
                    res.json({
                        userId: user.id,
                        userImage: user.image,
                        lastCards: [result, lastCards[0]],
                        calendarMoods: allCardMood,
                    });
                }
            } else {
                // create card
                const result = await cardDataMapper.create(
                    text,
                    video,
                    audio,
                    image,
                    moodLabel,
                    Number(userId),
                );
                result.moodLabel = 'neutral';
                result.dateString = dateStringFunction(result.created_at);
                return res.json({
                    userId: user.id,
                    userImage: user.image,
                    lastCards: [result],
                    calendarMoods: [
                        {
                            id: result.id,
                            user_id: user.id,
                            label: 'neutral',
                            created_at: result.created_at,
                        },
                    ],
                });
            }
        }
    },

    // Function to create or update card
    async createOrUpdate(req, res) {
        const { userId } = req.params;
        const {
            text,
            moodLabel,
        } = req.body;

        // At least one medium must be changed
        if (!text && !moodLabel) {
            return res.json('Nothing changed');
        }

        // find the last created card by user
        const lastCard = await cardDataMapper.findLatestByUserPk(userId);

        // Case there is no card created before or last card's date is not matching
        if (!lastCard) {
            // create card
            const result = await cardDataMapper.create(
                text,
                null,
                null,
                null,
                moodLabel,
                Number(userId),
            );
            return res.json(result);
        }

        const lastCardDate = lastCard.created_at.toISOString().split('T')[0];
        const currentDate = new Date().toISOString().split('T')[0];

        if (lastCardDate !== currentDate) {
            // create card
            const result = await cardDataMapper.create(
                text,
                null,
                null,
                null,
                moodLabel,
                Number(userId),
            );
            return res.json(result);
        }

        // update card
        const savedResult = await cardDataMapper.update(lastCard.id, req.body);
        return res.json(savedResult);
    },

    // Function delete Card
    async delete(req, res) {
        // check if card exists
        const card = await cardDataMapper.findByPk(Number(req.params.cardId));
        if (!card) {
            throw new ApiError(404, 'Card not found');
        }
        const lastCardDate = card.created_at.toISOString().split('T')[0];
        const currentDate = new Date().toISOString().split('T')[0];
        if (lastCardDate === currentDate) {
            throw new ApiError(405, 'Cannot delete the daily card');
        } else {
            if (card.image) {
                const storage = getStorage();
                // Create reference
                const fileRef = ref(storage, card.image);
                // Delete the file using the delete() method
                deleteObject(fileRef).then(() => {
                    // File deleted successfully
                    debug('File deleted successfully');
                }).catch((error) => {
                    // Some Error occurred
                    debug((`Error on delete: ${error.message}`));
                });
            }
            if (card.video) {
                const storage = getStorage();
                // Create reference
                const fileRef = ref(storage, card.video);
                // Delete the file using the delete() method
                deleteObject(fileRef).then(() => {
                    // File deleted successfully
                    debug('File deleted successfully');
                }).catch((error) => {
                    // Some Error occurred
                    debug((`Error on delete: ${error.message}`));
                });
            }
            if (card.audio) {
                const storage = getStorage();
                // Create reference
                const fileRef = ref(storage, card.audio);
                // Delete the file using the delete() method
                deleteObject(fileRef).then(() => {
                    // File deleted successfully
                    debug('File deleted successfully');
                }).catch((error) => {
                    // Some Error occurred
                    debug((`Error on delete: ${error.message}`));
                });
            }

            await cardDataMapper.delete(req.params.userId, req.params.cardId);
            debug('card deleted');
            return res.status(204).json('Card deleted');
        }
    },

    async deleteOneElement(req, res) {
        const { userId } = req.params;
        const lastCard = await cardDataMapper.findLatestByUserPk(userId);
        const lastCardDate = lastCard.created_at.toISOString().split('T')[0];
        const currentDate = new Date().toISOString().split('T')[0];
        if (lastCardDate !== currentDate) {
            return res.json('No daily card');
        }
        const elementDeleted = await cardDataMapper.deleteOne(userId, req.body, currentDate);
        return res.json(elementDeleted);
    },

};
