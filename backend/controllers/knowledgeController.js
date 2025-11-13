import * as knowledgeService from '../services/knowledgeService.js';

// Get knowledge entries
export const getKnowledge = async (req, res) => {
  // For future AI-related user knowledge, use req.user._id or fallback to test
  const userId = req.user?._id || req.body.userId || "testUserId";
  
  const knowledge = await knowledgeService.getKnowledge(userId);
  res.json({ status: 'success', knowledge });
};

// Create new knowledge entry
export const createKnowledge = async (req, res) => {
  const userId = req.user?._id || req.body.userId || "testUserId";
  
  const entry = await knowledgeService.createKnowledge(userId, req.body);
  res.json({ status: 'success', entry });
};

// Update knowledge entry
export const updateKnowledge = async (req, res) => {
  const entryId = req.params.id;
  
  const entry = await knowledgeService.updateKnowledge(entryId, req.body);
  res.json({ status: 'success', entry });
};

// Delete knowledge entry
export const deleteKnowledge = async (req, res) => {
  const entryId = req.params.id;
  
  const result = await knowledgeService.deleteKnowledge(entryId);
  res.json({ status: 'success', ...result });
};