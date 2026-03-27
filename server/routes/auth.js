import express from 'express'; 
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import protect from '../middleware/authMiddleware.js';


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
        const user = await User.create({ name, email, password: hashed }); 

        const token = await generateToken(user._id, res);

        res.status(201).json({
            _id: user._id, 
            name: name, 
            email: email, 
            token: token, 
        });
    } catch (err) {
        return res.status(500).json({ message: err.message }); 
        console.log(err.message);
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

//post /api/auth/logout
// POST /api/auth/logout
router.post('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.json({ message: 'Logged out' });
});

export default router; 