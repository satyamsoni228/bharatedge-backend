const express = require('express');
const router = express.Router();
const pinnedController = require('../controllers/PinnedController');

router.get('/pinned', pinnedController.getPinnedInstruments);
router.post('/pinned/update', pinnedController.updatePinnedInstrument);

module.exports = router;
