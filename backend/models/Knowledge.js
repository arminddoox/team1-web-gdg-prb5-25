import mongoose from 'mongoose';

const knowledgeSchema = new mongoose.Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  tags: { type: [String], default: [] },
  scoreWeight: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.Mixed, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Knowledge', knowledgeSchema);