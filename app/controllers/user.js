const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userDataMapper = require('../models/user');
const { ApiError } = require('../helpers/errorHandler');
const { generateLimitedAccessToken, generateAccessToken } = require('../helpers/generatedToken');

const userController = {

    async profil(req, res) {
        const { userId } = req.params;
        const user = await userDataMapper.findByPk(Number(userId));

        // User does not exists
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        return res.json(user);
    },

    async signupAction(req, res) {
        // User already exists
        const user = await userDataMapper.findByEmail(req.body.email);
        if (user) {
            throw new ApiError(400, 'User already exist');
        }

        // Password confirm does not match
        if (req.body.password !== req.body.passwordConfirm) {
            throw new ApiError(400, 'Password does not match with password confirm');
        }

        // Hash with bcrypt
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(req.body.password, salt);

        // New user
        const newUser = await userDataMapper.insert(
            req.body.email,
            req.body.first_name,
            req.body.last_name,
            encryptedPassword,
        );
        return res.json(newUser);
    },

    async login(req, res) {
        const user = await userDataMapper.findByEmail(req.body.email);

        if (!user) {
            throw new ApiError(400, "User doesn't exists");
        }

        const validPwd = await bcrypt.compare(req.body.password, user.password);
        if (!validPwd) {
            throw new ApiError(400, 'Connection information is invalid');
        }

        const limitedAccessToken = generateLimitedAccessToken(user);

        return res.json({
            message: 'login',
            limitedToken: limitedAccessToken,
        });
    },

    authenticateToken(req, res, next) {
        console.log('utilisateur : ', req.params);
        const authHeader = req.headers.authorization;
        console.log(' requete dans le header', req.headers.authorization);
        const token = authHeader && authHeader.split(' ')[1];
        console.log('token : ', token);
        if (token == null) {
            return res.send('rien de present');
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.send('erreur 403');
            }
            req.params = user;
            next();
        });
    },

};

module.exports = userController;
