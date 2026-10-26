import express from 'express';
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { verifyToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.js';

const router = express.Router();

// User routes
router.post('/', verifyToken, createOrder);
router.get('/my-orders', verifyToken, getUserOrders);

// Admin-only order list
router.get('/', verifyToken, requireAdmin, getAllOrders);

// Single order view (protected, logic inside controller handles permissions)
router.get('/:id', verifyToken, getOrderById);

// Admin order status update
router.put('/:id/status', verifyToken, requireAdmin, updateOrderStatus);

export default router;
