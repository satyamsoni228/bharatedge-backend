const express = require('express');
const router = express.Router();
const ZerodhaPositionController = require('../controllers/ZerodhaPositionController');

router.get('/positions/:userId', ZerodhaPositionController.getPositions);

module.exports = router;
