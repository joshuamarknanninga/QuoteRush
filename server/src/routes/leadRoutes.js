const express = require('express');
const { body, param, query } = require('express-validator');
const {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  addNote
} = require('../controllers/leadController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/',
  [
    body('customerName').trim().notEmpty().withMessage('Customer name is required'),
    body('serviceType').trim().notEmpty().withMessage('Service type is required'),
    body('status').optional().isIn(['new', 'quoted', 'booked', 'completed', 'archived'])
  ],
  validateRequest,
  createLead
);

router.get('/', [query('status').optional().isIn(['new', 'quoted', 'booked', 'completed', 'archived'])], validateRequest, getLeads);

router.get('/:id', [param('id').isMongoId().withMessage('Invalid lead id')], validateRequest, getLead);

router.patch(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid lead id'),
    body('status').optional().isIn(['new', 'quoted', 'booked', 'completed', 'archived']),
    body('quoteAmount').optional().isFloat({ min: 0 })
  ],
  validateRequest,
  updateLead
);

router.delete('/:id', [param('id').isMongoId().withMessage('Invalid lead id')], validateRequest, deleteLead);

router.post(
  '/:id/notes',
  [param('id').isMongoId().withMessage('Invalid lead id'), body('body').trim().notEmpty().withMessage('Note body is required')],
  validateRequest,
  addNote
);

module.exports = router;
