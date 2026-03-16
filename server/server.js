import express from 'express'; 
import dotenv from "dotenv"; 
import cors from 'cors'; 
import mongoose from 'mongoose'; 
import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express(); 

app.use(cors({ origin : process.env.CLIENT_URL })); 
app.use(express.json());
app.use(cookieParser());

// routes 
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.get('/', (req, res) => res.json({ message: "Job tracker api up and running " })); 

await mongoose.connect(process.env.MONGO_URI); 
console.log("MongoDB connected"); 

app.listen(process.env.PORT || 5002, () => {
    console.log(`Server running on ${process.env.PORT || 5002}`);
});



