const fetch = require('node-fetch'); 
const axios = require('axios'); // Import axios library

const GainersLosers = require('../../models/GainersLosers');
const MarketStatus = require('../../models/MarketStatus');

const GAINERS_URL = 'https://www.nseindia.com/api/live-analysis-variations?index=gainers';
const LOSERS_URL = 'https://www.nseindia.com/api/live-analysis-variations?index=loosers';
const MARKET_STATUS_URL = 'https://www.nseindia.com/api/marketStatus';

module.exports.get_and_save_gainers_loosers = async (req, res) => {
    try {
        const gainersResponse = await fetch(GAINERS_URL);
        const losersResponse = await fetch(LOSERS_URL);
        
        if (!gainersResponse.ok || !losersResponse.ok) { // Check if responses are not successful
            console.error('Failed to fetch data:', !gainersResponse.ok ? 'Gainers' : 'Losers', gainersResponse.statusText, losersResponse.statusText);
            return res.status(400).json({
                message: 'Failed to fetch data'
            });
        }
        
        const gainersData = await gainersResponse.json(); // Extract data from response
        const losersData = await losersResponse.json(); // Extract data from response
        
        if (!gainersData || !losersData) { // Check if data is empty
            console.error('No data found in response:', gainersData, losersData);
            return res.status(400).json({
                message: 'No data found in response'
            });
        }
        
        let glData = await GainersLosers.findOne(); // Find existing document
        if (glData) {
            await GainersLosers.findByIdAndUpdate(glData._id, { // Update existing document
                gainers: gainersData,
                losers: losersData 
            });
        } else {
            const gainersLosers = new GainersLosers({ // Create new document
                gainers: gainersData,
                losers: losersData
            });
            await gainersLosers.save();
        }

        return res.status(200).json({
            message: 'Successfully Saved'
        });
        
    } catch (err) {
        console.error('Error in fetching or saving gainer or loser data:', err.message);
        return res.status(500).json({
            message: 'Internal server error',
            error: err.message
        });
    }   
}

module.exports.get_and_save_market_status = async (req, res) => {
    try {
        const response = await fetch(MARKET_STATUS_URL); // Fetch market status data
        if (!response.ok) { // Check if response is not successful
            console.error('Failed to fetch market status:', response.statusText);
            return res.status(400).json({
                message: 'Failed to fetch market status'
            });
        }
        
        const data = await response.json(); // Extract data from response
        
        if (!data) { // Check if data is empty
            console.error('No data found in market status response:', data);
            return res.status(400).json({
                message: 'No data found in market status response'
            });
        }
        
        let marketStatus = await MarketStatus.findOne(); // Find existing document
        if (marketStatus) {
            await MarketStatus.findByIdAndUpdate(marketStatus._id, { // Update existing document
                marketStatus: data
            });
        } else {
            marketStatus = new MarketStatus({ // Create new document
                marketStatus: data
            });
            await marketStatus.save();
        }

        return res.status(200).json({
            message: 'Saved successfully',
            marketStatus: data
        });
        
    } catch (err) {
        console.error('Error in fetching or saving market status data:', err.message);
        return res.status(500).json({
            message: 'Internal server error',
            error: err.message
        });
    }
}

module.exports.get_market_status = async (req, res) => {
    try {
        const marketStatus = await MarketStatus.find();
        if (marketStatus) {
            return  res.status(200).json({
                marketStatus: marketStatus[0]?.marketStatus
            });
        }
    } catch (err) {
        console.error('Error in getting market status:', err.message);
        return res.status(500).json({
            message: 'Internal server error',
            err: err
        });
    }
}

module.exports.get_gainers_loosers = async (req, res) => {
    try {
        const glData = await GainersLosers.find();
        if (glData) {
            return res.status(200).json({
                gainers: glData[0]?.gainers,
                losers: glData[0]?.losers
            });
        } 
    } catch (err) {
        console.error('Error in getting gainers and losers data:', err.message);
        return res.status(500).json({
            message: 'Internal server error',
            err: err
        });
    }
}

