const mongoose = require('mongoose');

const automationJobSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    type: {
      type: String,
      enum: ['lead_confirmation', 'quote_followup', 'appointment_reminder', 'review_request'],
      required: true
    },
    scheduledFor: { type: Date, required: true, index: true },
    status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending', index: true },
    payload: { type: Object, default: {} },
    lastError: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AutomationJob', automationJobSchema);
