const AccessCode = require('../models/AccessCode');
const crypto = require('crypto');

// Function to generate a new access code
const generateAccessCode = () => {
    return crypto.randomBytes(3).toString('hex').toUpperCase(); // Generates a random 6-character hex string
};

// Function to store the access code in the database
const storeAccessCode = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to the start of today

    // Check if today's access code already exists
    let todayCode = await AccessCode.findOne({ createdAt: { $gte: today } });

    if (!todayCode) {
        const accessCode = generateAccessCode();
        todayCode = await AccessCode.create({ code: accessCode });
        console.log('New access code generated and stored:', accessCode);
    } else {
        console.log('Access code already exists for today:', todayCode.code);
    }

    return todayCode.code;
};

// Function to validate the provided access code
const validateAccessCode = async (accessCode) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to the start of today

    const todayCode = await AccessCode.findOne({ createdAt: { $gte: today } }); // Get today's access code
    return todayCode && accessCode === todayCode.code;
};

module.exports = {
    generateAccessCode,
    storeAccessCode,
    validateAccessCode,
};


