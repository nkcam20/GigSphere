const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/send', authenticate, chatController.sendMessage);
router.get('/:contract_id', authenticate, chatController.getMessages);

module.exports = router;
