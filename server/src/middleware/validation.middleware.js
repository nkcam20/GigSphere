const { body, param, query, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }
  next();
};

const registerValidation = [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('role').isIn(['client', 'freelancer']).withMessage('Role must be either client or freelancer'),
  validate
];

const loginValidation = [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const gigValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('budget').isNumeric().withMessage('Budget must be a number'),
  body('skills_required').notEmpty().withMessage('At least one skill is required'),
  validate
];

const proposalValidation = [
  body('gig_id').isUUID().withMessage('Invalid gig ID'),
  body('cover_letter').isLength({ min: 20 }).withMessage('Cover letter must be at least 20 characters'),
  body('bid_amount').isNumeric().withMessage('Bid amount must be a number'),
  body('delivery_days').isInt({ min: 1 }).withMessage('Delivery days must be at least 1'),
  validate
];

const reviewValidation = [
  body('contract_id').isUUID().withMessage('Invalid contract ID'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  validate
];

module.exports = {
  registerValidation,
  loginValidation,
  gigValidation,
  proposalValidation,
  reviewValidation
};
