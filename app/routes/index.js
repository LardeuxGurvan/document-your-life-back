const express = require('express');
const controllerHandler = require('../helpers/apiControllerHandler');
const { userController, cardController } = require('../controllers');
const { ApiError } = require('../helpers/errorHandler');
const { errorHandler } = require('../helpers/errorHandler');
const { authenticateToken, refreshAuthenticateToken } = require('../middleware/middlewareToken');
const { upload, fieldsArray } = require('../middleware/multerMiddleware');

const router = express.Router();

// Log routes
router.post('/signup', controllerHandler(userController.signupAction));
router.post('/login', controllerHandler(userController.login));
router.get('/logout', controllerHandler(userController.logout));

// User routes (auth)
router.get('/user/:userId(\\d+)/profil', authenticateToken, controllerHandler(userController.profil));
router.patch('/user/:userId(\\d+)/profil', authenticateToken, controllerHandler(userController.updateProfil));
router.delete('/user/:userId(\\d+)/profil', authenticateToken, controllerHandler(userController.deleteProfil));

// Cards routes (auth)
router.route('/user/:userId(\\d+)/cards/today')

router.route('/user/:userId(\\d+)/cards/:cardId(\\d+)')
    .get(authenticateToken, controllerHandler(cardController.getCard))
    .put(authenticateToken, controllerHandler(upload.fields(fieldsArray)),
        controllerHandler(cardController.createOrUpdate))
    .delete(authenticateToken, controllerHandler(cardController.deleteOneElement));

router.get('/user/:userId(\\d+)/cards/:cardId(\\d+)', authenticateToken, controllerHandler(cardController.getCard));
router.delete('/user/:userId(\\d+)/cards/:cardId(\\d+)', authenticateToken, controllerHandler(cardController.delete));

router.get('/user/:userId(\\d+)/dashboard', authenticateToken, controllerHandler(cardController.getAllElement));

// Refresh token
router.post('/api/refreshToken', refreshAuthenticateToken);

router.use(() => {
    throw new ApiError(404, 'API Route not found');
});

router.use((err, _, res, next) => {
    errorHandler(err, res, next);
});

module.exports = router;
