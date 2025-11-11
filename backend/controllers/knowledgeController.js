import {
    getKnowledgeService,
    createKnowledgeService,
    updateKnowledgeService,
    deleteKnowledgeService
} from "../services/knowledgeService.js";
import { createHabitService } from "../services/trackingService.js";

// Get knowledge entries
export const getKnowledge = async (req, res) => {
    const userId = req.body.userId || "testUserId";
    const result = await getKnowledgeService(userId);
    res.json(result);
};

// Create new knowledge entry
export const createKnowledge = async (req, res) => {
    const userId = req.body.userId || "testUserId";
    const result = await createKnowledgeService(userId, req.body);
    res.json(result);
};

// Update knowledge entry
export const updateKnowledge = async (req, res) => {
    const entryId = req.params.id;
    const result = await updateKnowledgeService(entryId, req.body);
    res.json(result);
};

// Delete knowledge entry
export const deleteKnowledge = async (req, res) => {
    const entryId = req.params.id;
    const result = await deleteKnowledgeService(entryId);
    res.json(result);
};