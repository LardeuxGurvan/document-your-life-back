require('dotenv').config();
const jwt = require('jsonwebtoken');
const userToken = require('../helpers/generatedToken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(401);
        }
        req.user = user;
        next();
    });
}

function refreshAuthenticateToken(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(401);
        }
        delete user.iat;
        console.log('token actualiser : ', userToken);
        const refreshedToken = userToken(user);
        res.send({
            accessToken: refreshedToken,
        });
    });
}

module.exports = { authenticateToken, refreshAuthenticateToken };
