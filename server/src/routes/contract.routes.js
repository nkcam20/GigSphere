const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contract.controller');
const paymentController = require('../controllers/payment.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', authenticate, contractController.getContracts);
router.post('/hire', authenticate, authorize('client'), contractController.hireFreelancer);
router.post('/:contract_id/deliver', authenticate, authorize('freelancer'), paymentController.deliverWork);
router.post('/:contract_id/approve', authenticate, authorize('client'), paymentController.approveDelivery);
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.stripeWebhook);
router.post('/checkout', authenticate, authorize('client'), paymentController.createCheckoutSession);

module.exports = router;
