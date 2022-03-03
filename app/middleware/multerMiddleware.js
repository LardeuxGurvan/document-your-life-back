const multer = require('multer');
const path = require('path');
const ApiError = require('../errors/apiError');

const imageStorage = multer.diskStorage({
    // Destination to store image
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
    destination: './user-storage/image/',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()
        }${path.extname(file.originalname)}`);
    },
});

const videoStorage = multer.diskStorage({
    // Destination to store video
    destination: '../user-storage/video/',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()
        }${path.extname(file.originalname)}`);
    },
});

const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 1000000, // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            // upload only png and jpg format
            return cb(new ApiError(403, 'Please upload a Image'));
        }
        cb(undefined, true);
    },
});

const videoUpload = multer({
    storage: videoStorage,
    limits: {
        fileSize: 10000000, // 10000000 Bytes = 10 MB
    },
    fileFilter(req, file, cb) {
        // upload only mp4 and mkv format
        if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
            return cb(new Error('Please upload a video'));
        }
        cb(undefined, true);
    },
});

module.exports = { imageUpload, videoUpload };
