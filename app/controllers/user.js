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
        // If Password change
        if (req.body.email) {
            req.body.email = req.body.email.toLowerCase();
        }
        if (req.body.password) {
            // Password confirm does not match
            if (req.body.password !== req.body.passwordConfirm) {
                throw new ApiError(400, 'Password does not match with password confirm');
            }

            // Hash with bcrypt
            const salt = await bcrypt.genSalt(10);
            const encryptedPassword = await bcrypt.hash(req.body.password, salt);
            const savedProfil = await userDataMapper.update(
                req.params.userId,
                req.body,
                encryptedPassword,
            );
            return res.json(savedProfil);
        }

        const savedProfil = await userDataMapper.update(req.params.userId, req.body);
        return res.json(savedProfil);
    },

    async signupAction(req, res) {
        // User already exists
        req.body.email = req.body.email.toLowerCase();
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
        return res.json({
            id: newUser.id,
            email: newUser.email,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
        });
    },

    async login(req, res) {
        req.body.email = req.body.email.toLowerCase();
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

        const userKeys = {
            id: user.id,
            email: user.email,
        };
        // Generate unique token
        const tokenGenerated = generateAccessToken(userKeys);
        const refreshTokenGenerated = refreshAccessToken(userKeys);
        return res
            .json({
                userId: user.id,
                message: 'login',
                tokenGenerated,
                refreshTokenGenerated,
            });
    },

    async logout(req, res) {
        res.json('logout');
    },

    async deleteProfil(req, res) {
        const { userId } = req.params;
        const user = await userDataMapper.findByPk(Number(userId));
        // User does not exists
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        await userDataMapper.deleteByPk(userId);
        return res.status(204).json('Delete complete!');
    },

};

module.exports = userController;
