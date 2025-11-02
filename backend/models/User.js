import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, default: null },
    authProvider: { type: [String], default: ["local"] },
    admin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: null }
});

export default mongoose.model("User", userSchema);