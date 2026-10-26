import express from 'express';
import {
  adminLogin,
  userLogin,
  register,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public auth routes
router.post('/admin/login', adminLogin);
router.post('/user/login', userLogin);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);

// Private auth routes
router.get('/me', verifyToken, getMe);
router.put('/profile', verifyToken, updateProfile);
router.put('/change-password', verifyToken, changePassword);

export default router;
