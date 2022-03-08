// const debug = require('debug')('app:cardController');
const fs = require('fs');
const { getStorage, ref, deleteObject } = require('firebase/storage');
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
                    if (lastCard?.image) {
                        const storage = getStorage();
                        const fileRef = storage(lastCard.image);

                        console.log(`File in database before delete exists : ${
                            fileRef.exists()}`);
                        // Delete the file using the delete() method
                        deleteObject(fileRef).then(() => {
                            // File deleted successfully
                            console.log('File Deleted');
                        }).catch((error) => {
                            // Some Error occurred
                            throw new ApiError((500, `Error on delete: ${error.message}`));
                        });
                        console.log(`File in database after delete exists : ${
                            fileRef.exists()}`);
                    }
                } else if (req.files.video) {
                    req.body.video = req.files.video[0].firebaseUrl;
                    if (lastCard?.video) {
                        // if medium, delete this medium
                        fs.unlinkSync(lastCard.video);
                    }
                } else if (req.files.audio) {
                    req.body.audio = req.files.audio[0].firebaseUrl;
                    if (lastCard?.audio) {
                        // if medium, delete this medium
                        fs.unlinkSync(lastCard.audio);
                    }
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
