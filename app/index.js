const express = require('express');
const cors = require('cors');
const router = require('./routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors(process.env.CORS_DOMAINS ?? '*'));

app.use(router);

module.exports = app;
