const multer = require('multer');
const path = require('path');
const ApiError = require('../errors/apiError');

/**
 * Multer configuration file
 * fileStorage: configure where the uploaded file is stored and the name of the file
 * fileFilter: filter the file with ext name
 * upload: the multer middleware
 * fieldsArray: files formats
 */

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'image') {
            cb(null, './user-storage/image/');
        } else if (file.fieldname === 'video') {
            cb(null, './user-storage/video/');
        } else if (file.fieldname === 'audio') {
            cb(null, './user-storage/audio/');
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()
        }${path.extname(file.originalname)}`);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'image') {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            // upload only png and jpg format
            return cb(new ApiError(403, 'Please upload a Image'));
        }
        cb(null, true);
    }
    if (file.fieldname === 'video') {
        if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
            return cb(new ApiError(403, 'Please upload a video'));
        }
        cb(null, true);
    }
    if (file.fieldname === 'audio') {
        if (!file.originalname.match(/\.(mp3)$/)) {
            return cb(new ApiError(403, 'Please upload an audio'));
        }
        cb(null, true);
    }
};

const upload = multer({
    storage: fileStorage,
    limits: {
        fileSize: 5000000, // 5000000 Bytes = 5 MB
    },
    fileFilter,
});

const fieldsArray = [{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }, { name: 'audio', maxCount: 1 }];

module.exports = { upload, fieldsArray };