// routes/HoldingRoutes.js
const express = require('express');
const router = express.Router();
const ZerodhaHoldingController = require('../controllers/ZerodhaHoldingController');

router.get('/holdings/:userId', ZerodhaHoldingController.getHoldings);

module.exports = router;
