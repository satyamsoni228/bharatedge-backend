const cron = require('node-cron');
const { storeAccessCode } = require('./helpers/accessCodeHelper');
const nodemailer = require('nodemailer');

// Function to send the access code via email
const sendAccessCodeEmail = async (accessCode) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'bharathedge.alerts@gmail.com',
            pass: 'deyegfidjlivskph'  // It's better to store sensitive data in environment variables
        }
    });

    const mailOptions = {
        from: 'bharathedge.alerts@gmail.com',
        to: 'ssoni6149@gmail.com',
        subject: 'Daily Access Code',
        text: `Your daily access code is: ${accessCode}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

// Function to execute the daily access code task
const executeDailyAccessCodeTask = async () => {
    try {
        const accessCode = await storeAccessCode();
        await sendAccessCodeEmail(accessCode);
    } catch (error) {
        console.error('Error in daily access code task:', error);
    }
};

// Schedule a job to run every day at 9:00 AM
cron.schedule('0 9 * * *', async () => {
    console.log('Executing daily access code task at 9:00 AM');
    await executeDailyAccessCodeTask();
});

module.exports = {
    executeDailyAccessCodeTask,
};

