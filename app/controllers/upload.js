const debug = require('debug')('app:uploadController');
const { getStorage, ref, deleteObject } = require('firebase/storage');
const firebase = require('firebase/app');
const cardDataMapper = require('../models/card');
const userDataMapper = require('../models/user');
const { ApiError } = require('../helpers/errorHandler');

const BUCKET = 'document-your-life-backend.appspot.com';
// init firebase for delete
firebase.initializeApp({
    storageBucket: BUCKET,
});

module.exports = {

    /**
     * @param {image} req.file It must be an image
     * @returns Card with the new image url
     */
    async imageUpload(req, res) {
        const { userId } = req.params;
        if (!req.file) {
            return res.json('Nothing changed');
        }

        const lastCard = await cardDataMapper.findLatestByUserPk(userId);

        const image = req.file.firebaseUrl;

        if (!lastCard) {
            // create card
            const result = await cardDataMapper.create(
                null,
                null,
                null,
                image,
                null,
                Number(userId),
            );
            return res.json(result);
        }

        const lastCardDate = lastCard.created_at.toISOString().split('T')[0];
        const currentDate = new Date().toISOString().split('T')[0];

        if (lastCardDate !== currentDate) {
            return res.json('Not the daily card');
        }

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
        const savedResult = await cardDataMapper.update(lastCard.id, { image });
        return res.json(savedResult);
    },

    /**
     * @param {video} req.file It must be an video
     * @returns Card with the new video url
     */
    async videoUpload(req, res) {
        const { userId } = req.params;
        if (!req.file) {
            return res.json('Nothing changed');
        }

        const lastCard = await cardDataMapper.findLatestByUserPk(userId);

        const video = req.file.firebaseUrl;

        if (!lastCard) {
            // create card
            const result = await cardDataMapper.create(
                null,
                video,
                null,
                null,
                null,
                Number(userId),
            );
            return res.json(result);
        }

        const lastCardDate = lastCard.created_at.toISOString().split('T')[0];
        const currentDate = new Date().toISOString().split('T')[0];

        if (lastCardDate !== currentDate) {
            return res.json('Not the daily card');
        }

        if (lastCard.video) {
            const storage = getStorage();
            // Create reference
            const fileRef = ref(storage, lastCard.video);
            // Delete the file using the delete() method
            deleteObject(fileRef).then(() => {
                // File deleted successfully
                debug('File deleted successfully');
            }).catch((error) => {
                // Some Error occurred
                debug((`Error on delete: ${error.message}`));
            });
        }

        const savedResult = await cardDataMapper.update(lastCard.id, { video });
        return res.json(savedResult);
    },

    /**
     * @param {audio} req.file It must be an audio
     * @returns Card with the new audio url
     */
    async audioUpload(req, res) {
        const { userId } = req.params;
        if (!req.file) {
            return res.json('Nothing changed');
        }

        const lastCard = await cardDataMapper.findLatestByUserPk(userId);

        const audio = req.file.firebaseUrl;

        if (!lastCard) {
            // create card
            const result = await cardDataMapper.create(
                null,
                null,
                audio,
                null,
                null,
                Number(userId),
            );
            return res.json(result);
        }

        const lastCardDate = lastCard.created_at.toISOString().split('T')[0];
        const currentDate = new Date().toISOString().split('T')[0];

        if (lastCardDate !== currentDate) {
            return res.json('Not the daily card');
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

        const savedResult = await cardDataMapper.update(lastCard.id, { audio });
        return res.json(savedResult);
    },

    /**
     * @param {image} req.file It must be an image
     * @returns User with the new video url
     */
    async avatarUpload(req, res) {
        const { userId } = req.params;
        const user = await userDataMapper.findByPk(Number(userId));

        // User does not exists
        if (!user) {
            throw new ApiError(404, 'User not found');
        } else if (!req.file) {
            res.json('Nothing changes');
        } else if (user.image) {
            const storage = getStorage();
            // Create reference
            const fileRef = ref(storage, user.image);
            // Delete the file using the delete() method
            deleteObject(fileRef).then(() => {
                // File deleted successfully
                debug('File deleted successfully');
            }).catch((error) => {
                // Some Error occurred
                debug((`Error on delete: ${error.message}`));
            });
        }

        const imageUrl = req.file.firebaseUrl;
        const newProfile = await userDataMapper.updateImage(userId, imageUrl);

        return res.json(newProfile);
    },

};
