/* eslint-disable consistent-return */
const multer = require('multer');
const ApiError = require('../errors/apiError');

/**
 * Multer configuration file
 * fileStorage: configure where the uploaded file is stored temp
 * fileFilter: filter the file with ext name
 * upload: the multer middleware
 */

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'avatar') {
        if (!file.originalname.match(/\.(jpeg|jfif|pjpeg|pjp|png|jpg|webp|svg|gif)$/)) {
            // upload only png and jpg format
            return cb(new ApiError(403, 'Please upload an Image'));
        }
        cb(null, true);
    }
    if (file.fieldname === 'image') {
        if (!file.originalname.match(/\.(jpeg|jfif|pjpeg|pjp|png|jpg|webp|svg|gif)$/)) {
            // upload only png and jpg format
            return cb(new ApiError(403, 'Please upload an Image'));
        }
        cb(null, true);
    }
    if (file.fieldname === 'video') {
        if (!file.originalname.match(/\.(mp4|m4v|avi|MPEG-4|mpeg|mpg|vob|mkv|webm|wmv|qt|mov|avi|flv|asf)$/)) {
            return cb(new ApiError(403, 'Please upload a video'));
        }
        cb(null, true);
    }
    if (file.fieldname === 'audio') {
        if (!file.originalname.match(/\.(mp3|wav|flac|FLAC|FLA|ogg|wma|aiff)$/)) {
            return cb(new ApiError(403, 'Please upload an audio'));
        }
        cb(null, true);
    }
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5000000, // 5000000 Bytes = 5 MB
    },
    fileFilter,
});

module.exports = upload;
