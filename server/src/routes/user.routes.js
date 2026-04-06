const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { reviewValidation } = require('../middleware/validation.middleware');

router.get('/profile/:id', userController.getProfile);
router.post('/review', authenticate, reviewValidation, userController.postReview);
router.get('/admin/stats', authenticate, authorize('admin'), userController.getAdminStats);

module.exports = router;
