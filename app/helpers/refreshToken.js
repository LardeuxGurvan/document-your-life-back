require('dotenv').config();
const jwt = require('jsonwebtoken');

function refreshAccessToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

module.exports = refreshAccessToken;
