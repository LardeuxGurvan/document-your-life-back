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

        return res.json({
            card,
            cardDate: card.created_at.created_at.toLocaleString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                year: 'numeric',
                month: 'long',
            }),
        });
    },

    async getAllElement(req, res) {
        const { userId } = req.params;
        const user = await userDataMapper.findByPk(Number(userId));
        const lastCards = await cardDataMapper.findCardsByUserPk(userId);
        const allCardMood = await cardDataMapper.selectAllCardsMood(userId);
        // Compares current date with the created date of last card created
        const lastCardDate = lastCards[0].created_at.toISOString().split('T')[0];
        const lastCardDateString = lastCards[0].created_at.toLocaleString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            year: 'numeric',
            month: 'long',
        });
        const currentDate = new Date().toISOString().split('T')[0];

        if (!lastCardDate === currentDate) {
            res.json({
                userId: user.id,
                userImage: user.image,
                dateString0: lastCardDateString,
                lastCard: lastCards[0],
                calendarMoods: allCardMood,
            });
        }
        res.json({
            userId: user.id,
            userImage: user.image,
            dateString0: lastCardDateString,
            dateString1: lastCards[1].created_at.toLocaleString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                year: 'numeric',
                month: 'long',
            }),
            lastCards,
            calendarMoods: allCardMood,
        });
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
        if (lastCardDate === currentDate) {
            const elementDeleted = await cardDataMapper.deleteOne(userId, req.body, currentDate);
            return res.json(elementDeleted);
        }
    },

};
