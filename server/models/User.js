import mongoose from 'mongoose'; 

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true }, 
    mailTrackingEnabled: { type: Boolean, default: true },
    mailTrackingToken: { type: String, unique: true, sparse: true },
    lastMailSyncAt: { type: Date },
}, { timestamps: true }); 

export default mongoose.model("User", userSchema);
