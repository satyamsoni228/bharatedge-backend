// scheduledTasks.js

const cron = require('node-cron');
const mongoose = require('mongoose');
const WatchlistItem = require('./models/WatchlistItem');
const ZerodhaPosition = require('./models/ZerodhaPosition');
const ZerodhaOrder = require('./models/ZerodhaOrder');
const ZerodhaHolding = require('./models/ZerodhaHolding');

// Function to delete expired WatchlistItem entries
async function deleteExpiredWatchlistItems() {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
  
    // Convert currentDate to Date object
    const currentDateObject = new Date(currentDate);
  
    // Find and delete expired WatchlistItem entries
    await WatchlistItem.deleteMany({ 
      expiry: { 
        $exists: true, 
        $ne: null,
        $lt: currentDateObject // Compare as Date objects
      } 
    });
    
  
    console.log('Expired WatchlistItem entries deleted.');
  }

// Function to clear Zerodha collections
async function clearZerodhaCollections() {
  await ZerodhaPosition.deleteMany({});
  await ZerodhaOrder.deleteMany({});
  await ZerodhaHolding.deleteMany({});
  console.log('Zerodha collections cleared.');
}

// Combined function to execute both deletion tasks
async function executeDailyTasks() {
  await deleteExpiredWatchlistItems();
  await clearZerodhaCollections();
  console.log('Daily cleanup tasks completed.');
}

// Schedule the task to run every day at 8:20 AM IST
cron.schedule('20 8 * * *', async () => {
  console.log('Running scheduled tasks...');
  await executeDailyTasks();
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});

module.exports = { executeDailyTasks };
