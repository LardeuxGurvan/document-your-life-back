const express = require('express');
const controllerHandler = require('../helpers/apiControllerHandler');
const { userController, cardController, uploadController } = require('../controllers');
const { ApiError } = require('../helpers/errorHandler');
const { errorHandler } = require('../helpers/errorHandler');
const { authenticateToken, refreshAuthenticateToken } = require('../middleware/middlewareToken');
const upload = require('../middleware/multerMiddleware');
const uploadFirebase = require('../services/firebase');

const router = express.Router();

/** Log routes
***********************************************************************
*/
router.post('/signup', controllerHandler(userController.signupAction));
router.post('/login', controllerHandler(userController.login));
router.get('/logout', controllerHandler(userController.logout));

/** User routes (auth)
***********************************************************************
*/
router.get('/user/:userId(\\d+)/profil', authenticateToken, controllerHandler(userController.profil));
router.patch('/user/:userId(\\d+)/profil', authenticateToken, controllerHandler(userController.updateProfil));
router.patch(
    '/user/:userId(\\d+)/avatar',
    authenticateToken,
    upload.single('avatar'),
    uploadFirebase,
    controllerHandler(uploadController.avatarUpload),
);

/** Cards routes (auth)
***********************************************************************
*/
router.route('/user/:userId(\\d+)/cards/today')
    .put(authenticateToken, controllerHandler(cardController.createOrUpdate))
    .delete(authenticateToken, controllerHandler(cardController.deleteOneElement));

router.patch(
    '/user/:userId(\\d+)/cards/image',
    authenticateToken,
    upload.single('image'),
    uploadFirebase,
    controllerHandler(uploadController.imageUpload),
);

router.patch(
    '/user/:userId(\\d+)/cards/video',
    authenticateToken,
    upload.single('video'),
    uploadFirebase,
    controllerHandler(uploadController.videoUpload),
);

router.patch(
    '/user/:userId(\\d+)/cards/audio',
    authenticateToken,
    upload.single('audio'),
    uploadFirebase,
    controllerHandler(uploadController.audioUpload),
);

router.route('/user/:userId(\\d+)/cards/:cardId(\\d+)')
    .get(authenticateToken, controllerHandler(cardController.getCard))
    .delete(authenticateToken, controllerHandler(cardController.delete));

/** Dashboard route (auth)
***********************************************************************
*/
router.get('/user/:userId(\\d+)/dashboard', authenticateToken, controllerHandler(cardController.getAllElements));

/** refresh token
***********************************************************************
*/
router.post('/api/refreshToken', refreshAuthenticateToken);

/** Error catcher
***********************************************************************
*/
router.use(() => {
    throw new ApiError(404, 'API Route not found');
});

router.use((err, _, res, next) => {
    errorHandler(err, res, next);
});

module.exports = router;
