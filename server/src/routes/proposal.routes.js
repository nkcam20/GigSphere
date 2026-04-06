const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposal.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { proposalValidation } = require('../middleware/validation.middleware');

router.post('/', authenticate, authorize('freelancer'), proposalValidation, proposalController.submitProposal);
router.get('/gig/:gig_id', authenticate, authorize(['client', 'freelancer']), proposalController.getProposalsByGig);

module.exports = router;
