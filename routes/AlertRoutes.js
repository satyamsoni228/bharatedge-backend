// routes/AlertRoutes.js
const express = require('express');
const router = express.Router();
const { createAlert } = require('../controllers/AlertController');



router.post('/alerts', createAlert);

module.exports = router;
