const express = require('express');
const router = express.Router();

const authRoutes = require('./authentication/AuthenticationRoutes');
const scriptRoutes = require('./script/ScriptRoutes');
const watchlistRoutes = require('./watchlist/WatchlistRoutes');
const userStockRoutes = require('./userStock/UserStockRoutes');
const orderRoutes = require('./order/OrderRoutes');
const analysisRoutes = require('./analysis/AnalysisRoutes.js');
const positionRoutes = require('./position/PositionRoutes.js');
const historicalRoutes = require('./historical/HistoricalRoutes.js');
const holidaysRoutes = require('./holidays/HolidaysRoutes.js');
const ZerodhaRoutes = require('./ZerodhaRoutes');
const OrderRoutes = require('./OrderRoutes');
const pinnedRoutes = require('./PinnedRoutes');
const alertRoutes = require('./AlertRoutes');
const HoldingRoutes = require('./HoldingRoutes');
const PositionRoutes = require('./PositionRoutes');
const basketRoutes = require('./basketRoutes');
const PlaceOrderRoutes = require('./PlaceOrderRoutes');

router.use('/api', pinnedRoutes);
router.use('/api/user', authRoutes);
router.use('/api/scrip', scriptRoutes);
router.use('/watchlist', watchlistRoutes);
router.use('/api/stock', userStockRoutes);
router.use('/api/order', orderRoutes);
router.use('/api/analysis', analysisRoutes);
router.use('/api/position', positionRoutes);
router.use('/api/historical', historicalRoutes);
router.use('/api/market-holidays', holidaysRoutes);
router.use('/zerodha', ZerodhaRoutes); // Register Zerodha routes
router.use('/api', OrderRoutes); // Register Order routes
router.use('/api', alertRoutes);
router.use('/api', HoldingRoutes); // Register Holding routes
router.use('/api', PositionRoutes); // Register Position routes
router.use('/api', basketRoutes);
router.use('/api/', PlaceOrderRoutes);

module.exports = router;






