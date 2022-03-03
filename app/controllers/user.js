const bcrypt = require('bcrypt');
const userDataMapper = require('../models/user');
const { ApiError } = require('../helpers/errorHandler');
const generateAccessToken = require('../helpers/generatedToken');
const refreshAccessToken = require('../helpers/refreshToken');

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
    async updateProfil(req, res) {
        const savedProfil = await userDataMapper.update(req.params.userId, req.body);
        let oldProfil = await userDataMapper.findByPk(Number(req.params.userId));

        // Password confirm does not match
        if (req.body.password !== req.body.passwordConfirm) {
            throw new ApiError(400, 'Password does not match with password confirm');
        }

        // Hash with bcrypt
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(req.body.password, salt);

        console.log('ancien profil : ', oldProfil);
        oldProfil = savedProfil;
        console.log('ancien profil modifier : ', oldProfil);
        return res.json(oldProfil, encryptedPassword);
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

        // Check user
        if (!user) {
            throw new ApiError(400, "User doesn't exists");
        }

        // Check password
        const validPwd = await bcrypt.compare(req.body.password, user.password);
        if (!validPwd) {
            throw new ApiError(400, 'Connection information is invalid');
        }

        // Generate unique token
        const tokenGenerated = generateAccessToken(user);
        const refreshTokenGenerated = refreshAccessToken(user);
        return res
            .json({
                message: 'login',
                tokenGenerated,
                refreshTokenGenerated,
            });
    },

    async logout(req, res) {
        delete req.session.user;
        return res.send('user logout');
    },

};

module.exports = userController;
