const express = require('express');
const controllerHandler = require('../helpers/apiControllerHandler');
const { userController } = require('../controllers');

const router = express.Router();

router.post('/signup', controllerHandler(userController.signupAction));
router.get('/user/:userId/profil', controllerHandler(userController.profil));

module.exports = router;
