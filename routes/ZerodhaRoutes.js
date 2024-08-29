const express = require('express');
const router = express.Router();
const ZerodhaController = require('../controllers/ZerodhaController');

// Correcting route definitions
router.get('/accounts/:userId', ZerodhaController.getAccounts); 
router.post('/add-account', ZerodhaController.addAccount); 
router.put('/account/:userId/:userid', ZerodhaController.updateAccount); 
router.delete('/account/:userId/:userid', ZerodhaController.deleteAccount); 
router.get('/account/:userId/:userid', ZerodhaController.getAccount);  
router.post('/account/:userid/login', ZerodhaController.loginAccount); // New route for login
router.post('/account/:userid/margins', ZerodhaController.getMargin); // New route for fetching margins
router.post('/selenium_login', ZerodhaController.seleniumLogin);
router.post('/account/:userid/order_margin', ZerodhaController.getOrderMargin);
router.post('/account/:userid/basket_margin', ZerodhaController.getBasketMargin);




module.exports = router;








