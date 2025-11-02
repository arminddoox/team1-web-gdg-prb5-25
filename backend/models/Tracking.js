import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    completed: { type: Boolean, default: false },
});

const habitSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    frequency: { type: mongoose.Schema.Types.Mixed, required: true },
    logs: { type: [logSchema], default: [] },
    streak: {
        current: { type: Number, default: 0 },
        longest: { type: Number, default: 0 },
        lastCompletedDate: {type: Date, default: null }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const statsSchema = new mongoose.Schema({
    totalHabits: { type: Number, default: 0 },
    activeStreaks: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
});

const trackingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    habits: { type: [habitSchema], default: [] },
    stats: { type: statsSchema, default: () => ({}) },
    lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.model("Tracking", trackingSchema);