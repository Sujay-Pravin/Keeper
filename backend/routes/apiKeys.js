import express from 'express';
import { 
  getAllApiKeys, 
  getApiKeyById, 
  createApiKey, 
  updateApiKey, 
  deleteApiKey 
} from '../controllers/apiKeyController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected by authentication
router.use(verifyToken);

// Routes that don't require PIN verification
router.get('/', getAllApiKeys);
router.post('/', createApiKey);
router.delete('/:id', deleteApiKey);
router.put('/:id', updateApiKey);

// Routes for revealing API keys (PIN verification handled in controller)
router.post('/:id/reveal', getApiKeyById);

export default router; 