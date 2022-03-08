const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require('../config/document-your-life-cloud-firebase-adminsdk-m0y0h-a95b323326.json');

const BUCKET = 'document-your-life-cloud.appspot.com';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: BUCKET,
});

const bucket = admin.storage().bucket();

// const deleteFile = (url) => {

//         const file = bucket.file(url);
//         console.log('file: ' + file);
//         file.delete().then(() => {
//             console.log()
//         })
// };

const uploadFirebase = (req, res, next) => {
    if (req.files.image) {
        const image = req.files.image[0];
        const name = `${image.fieldname}_${Date.now()}${path.extname(image.originalname)}`;

        const file = bucket.file(name);

        const stream = file.createWriteStream({
            metadata: {
                contentType: image.mimetype,
            },
        });

        stream.on('error', (error) => new Error(error));

        stream.on('finish', async () => {
            await file.makePublic();

            req.files.image[0].firebaseUrl = `https://storage.googleapis.com/${BUCKET}/${name}`;

            next();
        });

        stream.end(image.buffer);
    } else if (req.files.video) {
        const video = req.files.video[0];
        const name = `${video.fieldname}_${Date.now()}${path.extname(video.originalname)}`;

        const file = bucket.file(name);

        const stream = file.createWriteStream({
            metadata: {
                contentType: video.mimetype,
            },
        });

        stream.on('error', (error) => new Error(error));

        stream.on('finish', async () => {
            await file.makePublic();

            req.files.video[0].firebaseUrl = `https://storage.googleapis.com/${BUCKET}/${name}`;

            next();
        });

        stream.end(video.buffer);
    } else if (req.files.audio) {
        const audio = req.files.audio[0];
        const name = `${audio.fieldname}_${Date.now()}${path.extname(audio.originalname)}`;

        const file = bucket.file(name);

        const stream = file.createWriteStream({
            metadata: {
                contentType: audio.mimetype,
            },
        });

        stream.on('error', (error) => new Error(error));

        stream.on('finish', async () => {
            await file.makePublic();

            req.files.audio[0].firebaseUrl = `https://storage.googleapis.com/${BUCKET}/${name}`;

            next();
        });

        stream.end(audio.buffer);
    } else {
        return next();
    }
};

module.exports = uploadFirebase;
