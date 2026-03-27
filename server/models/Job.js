import mongoose from 'mongoose'; 

const jobSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    company: { type: String, required: true }, 
    role: { type: String, required: true }, 
    status: {
        type: String, 
        enum: ['Applied', 'Interview', 'Offer', 'Rejected'], 
        default: 'Applied'
    }, 
    notes: { type: String, default: '' }, 
    appliedDate: { type: Date, default: Date.now() }, 
    followupSent: { type: Boolean, default: false },
    source: {
        type: String,
        enum: ['manual', 'email'],
        default: 'manual',
    },
    mailMetadata: {
        messageId: { type: String },
        from: { type: String },
        subject: { type: String },
        receivedAt: { type: Date },
    },
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);
