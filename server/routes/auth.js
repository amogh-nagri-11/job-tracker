import express from 'express'; 
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import protect from '../middleware/authMiddleware.js';
import crypto from "node:crypto";
import { sendResetMail, sendVerificationMail } from '../utils/mailer.js';
import { isNativeError } from 'util/types';
import { isValidElement, useReducer } from 'react';

const router = express.Router(); 

// const generateToken = (id) => 
//     jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" }) 

//for refresh /api/auth/me
router.get('/me', protect, async (req, res) => {
    try { 
        const user = await User.findById(req.user.id).select('-password'); 
        if (!user) return res.status(404).json({ error: "User not found" }); 
        res.status(200).json(user); 
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}); 

//post test
router.post('/test', async (req, res) => {
    const { name, email, password } = req.body;
    res.json({
        name, email, password
    }); 
})

// post /api/auth/register 
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body; 

    try {
        const exists = await User.findOne({ email }); 
        if (exists) {
            return res.status(400).json({ message: "email already in use" }); 
        }

        const hashed = await bcrypt.hash(password, 10); 

        const verificationToken = crypto.randomBytes(30).toString("hex"); 
        const verificationTokenExpiry = new Date(Date.now() + 24*60*60*1000); 

        const user = await User.create({ 
            name, 
            email, 
            password: hashed,
            verificationToken, 
            verificationTokenExpiry,
        }); 

        // const token = await generateToken(user._id, res); invalid email should not be able to enter
        // this token should be generated only after successful validation of registered email

        await sendVerificationMail(email, verificationToken);

        res.status(201).json({
            _id: user._id, 
            name: name, 
            email: email, 
            // token: token, 
            message: "Registration Successful, check mail for verification",
            verificationToken, 
        });
    } catch (err) {
        return res.status(500).json({ message: err.message }); 
        console.log(err.message);
    }
});

// verify email, GET /api/auth/verify/:token
router.get('/verify/:token', async (req, res) => {
    console.log("Inside verify/token");
    try {
        const user = await User.findOne({
            verificationToken: req.params.token, 
            verificationTokenExpiry: { $gt: Date.now() },
        });
        
        if (!user) {
            return res.status(400).json({ error: "Invalid or expired verification link" }); 
        }

        user.isVerified = true; 
        user.verificationToken = undefined; 
        user.verificationTokenExpiry = undefined;
        await user.save();
        
        res.status(200).json({ message: "Email verified succesfully, you can login now"}); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// post api/auth/login 
router.post('/login', async (req, res) => {
    const { email, password } = req.body; 

    try {
        const user = await User.findOne({ email }); 
        if (!user) { 
            return res.status(400).json({ error: "Invalid email or password" });
        }

        if (!user.isVerified) {
            res.status(400).json({ error: "Please verify email before logging in" }); 
        }

        const match = await bcrypt.compare(password, user.password); 
        if (!match) {
            return res.status(400).json({ error: "Invalid email or password" }); 
        }

        const token = await generateToken(user._id, res);

        res.status(200).json({
            _id: user._id, 
            name: user.name, 
            email: email, 
            token: token,
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}); 

//forgot-password POST /api/auth/forgot-password 
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body; 
    try {
        const user = await User.findOne({ email }) 

        if (!user)
            res.status(200).json({ message: "If the email exists, a link has been sent" }); 

        const resetToken = crypto.randomBytes(32).toString('hex') 
        const resetTokenExpiry = new Date(Date.now() + 60*60*1000); 

        user.resetToken = resetToken; 
        user.resetTokenExpiry = resetTokenExpiry; 
        await user.save(); 

        await sendResetMail(user.email, resetToken); 

        res.status(200).json({ message: "If the email exists, a link has been sent" }); 
    } catch (err) {
        return res.status(500).json({ error: err.message }); 
    }
}); 

//reset-password POST /api/auth/reset-password
router.post('/reset-password', async (req,res) => {
    const { token, password } = req.body; 

    try {
        const user = await User.findOne({
            resetToken: token, 
            resetTokenExpiry: { $gt: Date.now() },
        });

        if (!user)
            return res.status(400).json({ error: "Invalid or expired reset link" }); 

        user.password = await bcrypt.hash(password, 10); 
        user.resetToken = undefined; 
        user.resetTokenExpiry = undefined; 
        await user.save(); 

        res.status(200).json({ message: "Password reset successfully" });
    } catch (err) { 
        res.status(500).json({ error: err.message });
    }
})

//patch /api/auth/update profile 
router.patch("/profile", protect, async (req, res) => {
    const { name, email, currentPassword, newPassword } = req.body; 
    try { 
        const user = await User.findById(req.user.id);

        if (!user) res.status(404).json({ error: "User not found" });

        if (name) user.name = name;
        
        if (email && user.email != email) {
            const exists = await User.findOne({ email }); 

            if (exists) {
                res.status(400).json({ error: "Email already in use" });
            }

            const verificationToken = crypto.randomBytes(32).toString('hex'); 
            const verificationTokenExpiry = new Date(Date.now() + 60*60*1000);

            user.email = email; 
            user.isVerified = false;
            user.verificationToken = verificationToken; 
            user.verificationTokenExpiry = verificationTokenExpiry; 

            await sendVerificationMail(user.email, verificationToken); 
        }

        if (currentPassword && newPassword) {
            const compare = await bcrypt.compare(currentPassword, user.password); 
            if (!compare) res.status(400).json({ error: "Wrong password" });
            if (newPassword.length < 6) res.status(400).json({ error: "New password must be atleast 6 characters "});
            user.password = await bcrypt.hash(newPassword, 10); 
        }

        await user.save();

        res.status(200).json({
        message: email && email !== user.email
            ? 'Profile updated. Please verify your new email.'
            : 'Profile updated successfully.',
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
        }
        });
    } catch (err) { 
        return res.status(500).json({ error: err.message });
    }
}); 

//post /api/auth/logout
// POST /api/auth/logout
router.post('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.json({ message: 'Logged out' });
});

export default router; 