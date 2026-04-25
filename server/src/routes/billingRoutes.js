const express = require('express');
const requireAuth = require('../middleware/auth');
const { createCheckoutSession, createBillingPortalSession } = require('../controllers/billingController');

const router = express.Router();

router.post('/checkout-session', requireAuth, createCheckoutSession);
router.post('/portal-session', requireAuth, createBillingPortalSession);

module.exports = router;
