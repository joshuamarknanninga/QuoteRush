const express = require('express');
const { body, param } = require('express-validator');
const { getPublicSettingsBySlug } = require('../controllers/settingsController');
const { createPublicLead } = require('../controllers/leadController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get('/settings/:slug', [param('slug').trim().notEmpty()], validateRequest, getPublicSettingsBySlug);
router.post(
  '/quote/:slug',
  [
    param('slug').trim().notEmpty(),
    body('customerName').trim().notEmpty().withMessage('Customer name is required'),
    body('serviceType').trim().notEmpty().withMessage('Service type is required')
  ],
  validateRequest,
  createPublicLead
);

module.exports = router;
