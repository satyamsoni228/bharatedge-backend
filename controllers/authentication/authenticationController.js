const User = require('../../models/User');
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const Order = require('../../models/Order');
const Position = require('../../models/Position');
const en = require("nanoid-good/locale/en");
const customAlphabet = require("nanoid-good").customAlphabet(en);

const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const idLength = 6;
const { validateAccessCode } = require('../../helpers/accessCodeHelper');

// User Signup
module.exports.signup_user = async (req, res) => {
    try {
        const { fullName, mobile, email, password, pin, accessCode } = req.body;

        if (!fullName || !email || !password || !mobile || !pin || !accessCode) {
            return res.status(400).json({
                status: 400,
                message: "All fields are required to register as a new user."
            });
        }

        const validAccessCode = await validateAccessCode(accessCode);
        if (!validAccessCode) {
            return res.status(400).json({
                status: 400,
                message: "Invalid access code."
            });
        }

        const isEmailexists = await User.findOne({ email });
        const isMobileExists = await User.findOne({ mobile });

        if (isEmailexists) {
            return res.status(400).json({
                status: 400,
                message: "A user with this email address already exists."
            });
        }

        if (isMobileExists) {
            return res.status(400).json({
                status: 400,
                message: "A user with this mobile number already exists."
            });
        }

        let hashPassword = await bcrypt.hash(password, 10);
        let hashPin = await bcrypt.hash(pin, 10);
        
        const generateId = customAlphabet(characters, idLength);
        const userId = generateId();

        const user = new User({
            userId: userId,
            fullName: fullName,
            email: email,
            mobile: mobile,
            password: hashPassword,
            pin: hashPin,
            totpEnabled: false,
            accessCode,
        });

        await user.save();

        let token = jwt.sign(
            { id: user._id, userId, fullName, email },
            process.env.TOKEN_KEY,
        );

        return res.status(200).json({
            success: true,
            data: {
                message: 'Registered successfully',
                userid: user._id,
                token,
            }
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({ status: 500, message: e.message });
    }
};

// User Signin
module.exports.signin_user = async (req, res) => {
    try {
        const { userId, password } = req.body;

        if (!userId || !password) {
            return res.status(400).json({ 
                status: 400, 
                message: "User ID and password are required to log in." 
            });
        }

        let user = await User.findOne({ userId });

        if (!user) {
            return res.status(400).json({
                status: 400,
                message: "This user ID you have entered is not available."
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({
                status: 400,
                message: "Invalid user ID and password."
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                message: 'Password verified',
                userid: user._id,
                totpEnabled: user.totpEnabled,
            }
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({ status: 500, message: e.message });
    }
};

// PIN Verification
module.exports.verify_pin = async (req, res) => {
    try {
        const { userId, pin } = req.body;

        if (!userId || !pin) {
            return res.status(400).json({
                status: 400,
                message: "User ID and PIN are required."
            });
        }

        let user = await User.findOne({ userId });

        if (!user) {
            return res.status(400).json({
                status: 400,
                message: "Invalid user ID."
            });
        }

        const pinMatch = await bcrypt.compare(pin, user.pin);

        if (!pinMatch) {
            return res.status(400).json({
                status: 400,
                message: "Invalid PIN."
            });
        }

        let token = jwt.sign(
            { id: user._id, userId: user.userId, fullName: user.fullName, email: user.email },
            process.env.TOKEN_KEY,
        );

        return res.status(200).json({
            success: true,
            data: {
                message: 'Login successful',
                userid: user._id,
                token,
            }
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({ status: 500, message: e.message });
    }
};

// TOTP Management
module.exports.enable_totp = async (req, res) => {
    try {
        const { userId, totpSecret } = req.body;

        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(400).json({
                status: 400,
                message: "Invalid user ID."
            });
        }

        user.totpSecret = totpSecret;
        user.totpEnabled = true;
        await user.save();

        res.status(200).json({
            success: true,
            message: "TOTP enabled successfully.",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 500,
            message: err.message,
        });
    }
};

module.exports.disable_totp = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(400).json({
                status: 400,
                message: "Invalid user ID."
            });
        }

        user.totpSecret = null;
        user.totpEnabled = false;
        await user.save();

        res.status(200).json({
            success: true,
            message: "TOTP disabled successfully.",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 500,
            message: err.message,
        });
    }
};

// Change Password
module.exports.change_password = async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;

        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({
                status: 400,
                message: "Invalid user ID."
            });
        }

        const passwordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatch) {
            return res.status(400).json({
                status: 400,
                message: "Current password is incorrect."
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully.",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 500,
            message: err.message,
        });
    }
};

module.exports.get_trader_by_userId = async (req, res) => {
    const { userId } = req.query;
    try {
        const trader = await User.findOne({ _id: userId }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 });
        return res.status(200).json({
            success: true,
            data: {
                trader: trader
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 500,
            message: err.message
        });
    }
}

module.exports.reset_user_funds = async (req, res) => {
    const { userId } = req.query;
    try {
        await Order.deleteMany({ userId: userId });
        await Position.deleteMany({ userId: userId });
        await User.findOneAndUpdate({ _id: userId }, {
            availableFunds: 100000
        });

        return res.status(200).json({
            success: true,
            message: 'Reset Successfully'
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    }
}