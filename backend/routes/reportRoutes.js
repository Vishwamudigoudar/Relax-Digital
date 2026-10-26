import express from 'express';
import { getDashboardStats, exportReportData } from '../controllers/reportController.js';
import { verifyToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.js';

const router = express.Router();

router.use(verifyToken, requireAdmin);

router.get('/dashboard-stats', getDashboardStats);
router.get('/export', exportReportData);

export default router;
