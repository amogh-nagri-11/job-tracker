import express from 'express'; 
import dotenv from "dotenv"; 
import cors from 'cors'; 
import mongoose from 'mongoose'; 
import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import mailRoutes from './routes/mail.js';
import cookieParser from 'cookie-parser';
import { startMailTrackingServer } from './services/mailTrackerService.js';
import helmet from 'helmet';
import passport from 'passport';

dotenv.config();

const app = express(); 

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,       
}));

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(passport.initialize());

// routes 
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/mail', mailRoutes);
app.get('/', (req, res) => res.json({ message: "Job tracker api up and running " })); 

await mongoose.connect(process.env.MONGO_URI); 
console.log("MongoDB connected"); 

startMailTrackingServer();

app.listen(process.env.PORT || 5002, () => {
    console.log(`Server running on ${process.env.PORT || 5002}`);
});

