import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingController.js';
import { verifyToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.js';

const router = express.Router();

// Settings are readable by public/authenticated, but only writable by Admin
router.get('/', getSettings);
router.put('/', verifyToken, requireAdmin, updateSettings);

export default router;
