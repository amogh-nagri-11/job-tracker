import mongoose from 'mongoose';
import dotenv from 'dotenv'; 
import User from '../models/User.js';

dotenv.config(); 

await mongoose.connect(process.env.MONGO_URI)

const result = await User.updateMany(
    { isVerified: { $exists: false } }, 
    { $set: { isVerified: true } } 
); 

console.log(`Updated ${User.modifiedCount} users`)

await mongoose.disconnect(); 