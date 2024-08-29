const express = require('express');
const { addWatchlistItem, removeWatchlistItem, getWatchlistItems } = require('../../controllers/watchlist/WatchlistController');

const router = express.Router();

router.post('/add', addWatchlistItem);
router.delete('/remove/:watchlistId/:instrument_token', removeWatchlistItem);
router.get('/:watchlistId/:userId', getWatchlistItems);

module.exports = router;

