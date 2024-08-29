const express = require('express');
const router = express.Router();
const ZerodhaOrderController = require('../controllers/ZerodhaPlaceOrderController');

router.post('/place_order', ZerodhaOrderController.placeOrder);

module.exports = router;
