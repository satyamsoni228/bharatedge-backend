const express = require('express');
const router = express.Router();
const ZerodhaOrderController = require('../controllers/ZerodhaOrderController');

router.get('/orders/:userId', ZerodhaOrderController.getOrders);
router.get('/orders/:userId/open', ZerodhaOrderController.getOpenOrders);
router.get('/orders/:userId/executed', ZerodhaOrderController.getExecutedOrders);

module.exports = router;

