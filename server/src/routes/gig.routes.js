const express = require('express');
const router = express.Router();
const gigController = require('../controllers/gig.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { gigValidation } = require('../middleware/validation.middleware');

router.get('/', gigController.getGigs);
router.get('/:id', gigController.getGigById);
router.post('/', authenticate, authorize('client'), gigValidation, gigController.postGig);

module.exports = router;
