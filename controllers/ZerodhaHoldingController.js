// controllers/ZerodhaHoldingController.js
const axios = require('axios');
const ZerodhaHolding = require('../models/ZerodhaHolding');
const ZerodhaAccount = require('../models/ZerodhaAccount');

const fetchAndStoreHoldings = async () => {
  try {
    const accounts = await ZerodhaAccount.find();
    for (const account of accounts) {
      if (!account.enc_token) continue;
      try {
        const response = await axios.post('http://localhost:5001/holdings', { userid: account.userid });
        const holdings = response.data;

        for (const holding of holdings) {
          holding.account_userid = account.userid;
          await ZerodhaHolding.updateOne(
            { tradingsymbol: holding.tradingsymbol, account_userid: holding.account_userid },
            { $set: holding },
            { upsert: true }
          );
        }
      } catch (error) {
        console.error(`Error fetching holdings for account ${account.userid}:`, error);
      }
    }
  } catch (error) {
    console.error('Error fetching and storing holdings:', error);
  }
};

const getHoldings = async (req, res) => {
  const { userId } = req.params;
  try {
    const holdings = await ZerodhaHolding.find({ account_userid: userId });
    res.json(holdings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

setInterval(fetchAndStoreHoldings, 10 * 1000); // Fetch every 10 seconds

module.exports = {
  fetchAndStoreHoldings,
  getHoldings,
};
