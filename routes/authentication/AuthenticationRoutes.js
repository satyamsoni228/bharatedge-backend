const router = require('express').Router();
const authController = require("../../controllers/authentication/authenticationController");

router.post('/signup', authController.signup_user);
router.post('/signin', authController.signin_user);
router.get('/get?', authController.get_trader_by_userId);
router.patch('/reset?', authController.reset_user_funds);
router.post('/verify-pin', authController.verify_pin);

// TOTP Management Routes
router.post('/enable-totp', authController.enable_totp);
router.post('/disable-totp', authController.disable_totp);

// Account Security Routes
router.patch('/change-password', authController.change_password);


module.exports = router;