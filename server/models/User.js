import mongoose from 'mongoose'; 

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true }, 
    isVeified: { type: Boolean, default: false }, 
    verificationToken: { type: String }, 
    verificationTokenExpiry: { type: Date }, 
    mailTrackingEnabled: { type: Boolean, default: true },
    mailTrackingToken: { type: String, unique: true, sparse: true },
    lastMailSyncAt: { type: Date },
}, { timestamps: true }); 

export default mongoose.model("User", userSchema);
