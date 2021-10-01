const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth, checkUser, protectRoute } = require('../midllewares/userMidllewares');

router.get('*', checkUser);
router.get('/', (req, res) => {res.render('home')});

router.get('/signUp', protectRoute, userController.signup_get);
router.post('/signUp', userController.signup_post);

router.get('/logIn', protectRoute, userController.login_get);
router.post('/logIn', userController.login_post);

router.get('/main', requireAuth, (req, res) => res.render('main'));

router.get('/logOut', userController.logout_get);

module.exports = router;
