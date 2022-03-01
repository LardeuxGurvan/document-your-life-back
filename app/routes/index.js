const express = require('express');
const controllerHandler = require('../helpers/apiControllerHandler');
const { userController, cardController } = require('../controllers');
const { ApiError } = require('../helpers/errorHandler');
const { errorHandler } = require('../helpers/errorHandler');

const router = express.Router();

router.post('/signup', controllerHandler(userController.signupAction));
router.get('/user/:userId(\\d+)/profil', controllerHandler(userController.profil));
router.post('/login', controllerHandler(userController.login));
// router.get('/user/:userId(\\d+)/cards/:cardId(\\d+)', controllerHandler(card))
router.post('/user/:userId(\\d+)/cards/today', controllerHandler(cardController.create));

router.use(() => {
    throw new ApiError(404, 'API Route not found');
});

router.use((err, _, res, next) => {
    errorHandler(err, res, next);
});

module.exports = router;
