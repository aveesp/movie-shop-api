const express= require('express');
const router = express.Router();

const userController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.delete('/', checkAuth, userController.deleteUser)

module.exports = router;