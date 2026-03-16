import express from 'express'; 
import Job from '../models/Job.js';
import protect from "../middleware/authMiddleware.js";

const router = express.Router(); 

//use authMiddleware 
router.use(protect);

// get jobs api - list all jobs for the logged in user
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        return res.status(500).json({ error: err.message }); 
    }
});

// post add jobs 
router.post('/', async (req, res) => {
    const { company, role, status, notes, appliedDate } = req.body; 
    try {
        const job = await Job.create({
            user: req.user.id, 
            company, 
            role, 
            status, 
            notes, 
            appliedDate, 
        }); 

        res.status(201).json(job);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}); 

// patch - /api/jobs/:id - update status or notes 
router.patch('/:id', async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, user: req.user.id }); 
        if (!job) return res.status(404).json({ error: "Job not found" });

        Object.assign(job, req.body); 
        await job.save(); 

        res.status(201).json(job);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}); 

//delete - /api/jobs/:id - delete a job 
router.delete('/:id', async (req, res) => {
    try {
        const job = await Job.findOneAndDelete({ _id: req.params.id, user: req.user.id }); 
        if (!job) return res.status(404).json({ error: "Job not found" }); 

        res.json({ message: "Job deleted" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

export default router; 