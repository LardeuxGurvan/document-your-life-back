const debug = require('debug')('app:cardController');
const { getStorage, ref, deleteObject } = require('firebase/storage');
const firebase = require('firebase/app');
const cardDataMapper = require('../models/card');
const userDataMapper = require('../models/user');
const { ApiError } = require('../helpers/errorHandler');

// init firebase for delete
firebase.initializeApp();

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

    async getAllElement(req, res) {
        const { userId } = req.params;
        const text = null;
        const video = null;
        const audio = null;
        const image = null;
        const moodLabel = null;
        const dateStringFuction = (date) => date.toLocaleString('fr-FR', {
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
                lastCards[0].dateString = dateStringFuction(lastCards[0].created_at);

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
                        result.dateString = dateStringFuction(result.created_at);
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
                            calendarMoods: [{ todayMood },
                                allCardMood[0],
                            ],
                        });
                    }
                } else if (lastCardDate === currentDate) {
                    lastCards[1].dateString = dateStringFuction(lastCards[0].created_at);
                    res.json({
                        userId: user.id,
                        userImage: user.image,
                        lastCard: lastCards,
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
                    result.dateString = dateStringFuction(result.created_at);
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
                result.dateString = dateStringFuction(result.created_at);
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

    async createOrUpdate(req, res) {
        const { userId } = req.params;
        const {
            text,
            moodLabel,
        } = req.body;

        // At least one medium must be changed
        if (!text && !req.files.image && !req.files.video && !req.files.audio && !moodLabel) {
            return res.json('Nothing changed');
        }

        // find the last created card by user
        const lastCard = await cardDataMapper.findLatestByUserPk(userId);

        // Check if there is a file
        if (req.files) {
            if (req.files.image || req.files.video || req.files.audio) {
                // add path to the body data
                if (req.files.image) {
                    req.body.image = req.files.image[0].firebaseUrl;
                } else if (req.files.video) {
                    req.body.video = req.files.video[0].firebaseUrl;
                } else if (req.files.audio) {
                    req.body.audio = req.files.audio[0].firebaseUrl;
                } else {
                    throw new ApiError(500, 'something went wrong');
                }
            }
        }
        // Case there is no card created before or last card's date is not matching
        if (!lastCard) {
            // create card
            const result = await cardDataMapper.create(
                text,
                req.body.video,
                req.body.audio,
                req.body.image,
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
                req.body.video,
                req.body.audio,
                req.body.image,
                moodLabel,
                Number(userId),
            );
            return res.json(result);
        }

        // delete the last medium
        // todo DRY, I can refactor this part
        if (lastCard.image) {
            const storage = getStorage();
            // Create reference
            const fileRef = ref(storage, lastCard.image);
            // Delete the file using the delete() method
            deleteObject(fileRef).then(() => {
                // File deleted successfully
                debug('File deleted successfully');
            }).catch((error) => {
                // Some Error occurred
                debug((`Error on delete: ${error.message}`));
            });
        }

        if (lastCard.video) {
            const storage = getStorage();
            // Create reference
            const fileRef = ref(storage, lastCard.video);
            // Delete the file using the delete() method
            deleteObject(fileRef).then(() => {
                debug('File deleted successfully');
            }).catch((error) => {
                // Some Error occurred
                debug((`Error on delete: ${error.message}`));
            });
        }

        if (lastCard.audio) {
            const storage = getStorage();
            // Create reference
            const fileRef = ref(storage, lastCard.audio);
            // Delete the file using the delete() method
            deleteObject(fileRef).then(() => {
                // File deleted successfully
                debug('File deleted successfully');
            }).catch((error) => {
                // Some Error occurred
                debug((`Error on delete: ${error.message}`));
            });
        }

        // update card
        const savedResult = await cardDataMapper.update(lastCard.id, req.body);
        return res.json(savedResult);
    },

    async delete(req, res) {
        await cardDataMapper.delete(req.params.userId, req.params.cardId);
        console.log('card deleted');
        return res.status(204).json('Card deleted!');
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
