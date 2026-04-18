const express = require('express');
const { body } = require('express-validator');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get('/', getSettings);
router.patch(
  '/',
  [
    body('businessEmail').optional().isEmail().withMessage('Invalid business email'),
    body('defaultReminderHours').optional().isInt({ min: 1, max: 168 }),
    body('defaultFollowupHours').optional().isInt({ min: 1, max: 336 }),
    body('intakeFormSlug').optional().matches(/^[a-z0-9-]+$/)
  ],
  validateRequest,
  updateSettings
);


module.exports = router;
