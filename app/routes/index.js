const express = require('express');
const controllerHandler = require('../helpers/apiControllerHandler');
const { userController } = require('../controllers');
const { ApiError } = require('../helpers/errorHandler');
const { errorHandler } = require('../helpers/errorHandler');

const router = express.Router();

router.post('/signup', controllerHandler(userController.signupAction));
router.get('/user/:userId/profil', controllerHandler(userController.profil));
router.post('/login', controllerHandler(userController.login));

router.use(() => {
    throw new ApiError(404, 'API Route not found');
});
router.use((err, _, response, next) => {
    errorHandler(err, response, next);
});

module.exports = router;
