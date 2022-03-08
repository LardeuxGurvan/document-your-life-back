const debug = require('debug')('app:firebaseUpload');
const admin = require('firebase-admin');
const path = require('path');

const BUCKET = 'document-your-life-cloud.appspot.com';

// Firebase init with credentials
admin.initializeApp({
    credential: admin.credential.cert({
        type: process.env.TYPE,
        project_id: process.env.PROJECTID,
        private_key_id: process.env.PRIVATEKEYID,
        private_key: process.env.PRIVATEKEY,
        client_email: process.env.CLIENTEMAIL,
        client_id: process.env.CLIENTID,
        auth_uri: process.env.AUTHURI,
        token_uri: process.env.TOKENURI,
        auth_provider_x509_cert_url: process.env.AUTHPROVIDER,
        client_x509_cert_url: process.env.CLIENTCERTURL,
    }),
    storageBucket: BUCKET,
});

const bucket = admin.storage().bucket();

// Upload middleware
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
            debug('File uploaded successfully');
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
            debug('File uploaded successfully');
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
            debug('File uploaded successfully');
            next();
        });

        stream.end(audio.buffer);
    } else {
        return next();
    }
};

module.exports = uploadFirebase;
