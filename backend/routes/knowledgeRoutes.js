import express from 'express';
import {
    getKnowledge,
    createKnowledge,
    updateKnowledge,
    deleteKnowledge,
} from '../controllers/knowledgeController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all knowledge routes
router.use(authMiddleware);

// CRUD routes for user knowledge entries
router.get('/', getKnowledge);
router.post('/', createKnowledge);
router.put('/:id', updateKnowledge);
router.delete('/:id', deleteKnowledge);

export default router;