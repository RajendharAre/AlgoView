const express = require('express');
const router = express.Router();
const { sendSupportEmail } = require('../controllers/supportController');

router.get('/contact', (req, res) => {
	return res.status(405).json({
		error: 'Method not allowed. Use POST /api/support/contact with JSON body.'
	});
});

router.post('/contact', sendSupportEmail);

module.exports = router;
