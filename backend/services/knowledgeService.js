import Knowledge from '../models/Knowledge.js';

// Flag for using placeholder (MVP/testing) or real DB functions
const USE_PLACEHOLDER = false; // set true if you want to use placeholders

// ---------------------------
// Knowledge Service Functions
// ---------------------------

// Get knowledge entries
export const getKnowledgeService = async (userId) => {
  if (USE_PLACEHOLDER) {
    return { message: "getKnowledgeService - placeholder", userId, entries: [] };
  }
  // Real DB
  const entries = await Knowledge.find({});
  return entries;
};

// Create new knowledge entry
export const createKnowledgeService = async (userId, entryData) => {
  if (USE_PLACEHOLDER) {
    return { message: "createKnowledgeService - placeholder", userId, entry: entryData };
  }
  // Real DB
  const entry = await Knowledge.create({ ...entryData, createdBy: userId });
  return entry;
};

// Update knowledge entry
export const updateKnowledgeService = async (entryId, entryData) => {
  if (USE_PLACEHOLDER) {
    return { message: "updateKnowledgeService - placeholder", entryId, entry: entryData };
  }
  // Real DB
  const entry = await Knowledge.findByIdAndUpdate(entryId, entryData, { new: true });
  if (!entry) throw new Error('Knowledge entry not found');
  return entry;
};

// Delete knowledge entry
export const deleteKnowledgeService = async (entryId) => {
  if (USE_PLACEHOLDER) {
    return { message: "deleteKnowledgeService - placeholder", entryId };
  }
  // Real DB
  await Knowledge.findByIdAndDelete(entryId);
  return { message: 'Knowledge entry deleted' };
};