const express = require('express');
const controllerHandler = require('../helpers/apiControllerHandler');
const { userController, cardController } = require('../controllers');
const { ApiError } = require('../helpers/errorHandler');
const { errorHandler } = require('../helpers/errorHandler');
const { authenticateToken, refreshAuthenticateToken } = require('../helpers/middlewareToken');

const router = express.Router();

router.post('/signup', controllerHandler(userController.signupAction));

router.get('/user/:userId/profil', authenticateToken, controllerHandler(userController.profil));
router.post('/login', controllerHandler(userController.login));
router.post('/logout', controllerHandler(userController.logout));
router.get('/user/:userId/dashboard', controllerHandler());
router.post('/api/refreshtoken', refreshAuthenticateToken);

router.use((err, _, response, next) => {
    errorHandler(err, response, next);
});


router.use(() => {
    throw new ApiError(404, 'API Route not found');
});

router.use((err, _, res, next) => {
    errorHandler(err, res, next);
});

module.exports = router;
