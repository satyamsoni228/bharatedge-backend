const axios = require('axios');
const ZerodhaPosition = require('../models/ZerodhaPosition');
const ZerodhaAccount = require('../models/ZerodhaAccount');

const fetchAndStorePositions = async () => {
  try {
    const accounts = await ZerodhaAccount.find();
    for (const account of accounts) {
      if (!account.enc_token) continue;
      try {
        const response = await axios.post('http://localhost:5001/positions', { userid: account.userid });
        const positions = response.data;

        for (const position of positions.day) {
          position.account_userid = account.userid;
          await ZerodhaPosition.updateOne(
            { tradingsymbol: position.tradingsymbol, account_userid: position.account_userid },
            { $set: position },
            { upsert: true }
          );
        }
      } catch (error) {
        console.error(`Error fetching positions for account ${account.userid}:`, error);
      }
    }
  } catch (error) {
    console.error('Error fetching and storing positions:', error);
  }
};

const getPositions = async (req, res) => {
  const { userId } = req.params;
  try {
    const positions = await ZerodhaPosition.find({ account_userid: userId });
    res.json(positions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

setInterval(fetchAndStorePositions, 1 * 1000); // Fetch every 10 seconds

module.exports = {
  fetchAndStorePositions,
  getPositions,
};
