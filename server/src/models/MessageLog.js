const mongoose = require('mongoose');

const messageLogSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    channel: { type: String, enum: ['sms', 'email'], required: true },
    direction: { type: String, enum: ['outbound', 'inbound'], required: true },
    body: { type: String, required: true },
    status: { type: String, enum: ['pending', 'sent', 'failed', 'simulated'], required: true },
    sentAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('MessageLog', messageLogSchema);
