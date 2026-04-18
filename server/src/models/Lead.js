const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    body: { type: String, required: true, trim: true },
    authorName: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

const communicationSchema = new mongoose.Schema(
  {
    channel: { type: String, enum: ['sms', 'email'], required: true },
    direction: { type: String, enum: ['outbound', 'inbound'], required: true, default: 'outbound' },
    body: { type: String, required: true },
    status: { type: String, enum: ['pending', 'sent', 'failed', 'simulated'], default: 'pending' },
    sentAt: { type: Date }
  },
  { _id: false }
);

const leadSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, trim: true, default: '' },
    customerEmail: { type: String, lowercase: true, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },
    serviceType: { type: String, required: true, trim: true },
    preferredDate: { type: Date },
    message: { type: String, trim: true, default: '' },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ['new', 'quoted', 'booked', 'completed', 'archived'],
      default: 'new',
      index: true
    },
    quoteAmount: { type: Number, min: 0, default: 0 },
    notes: [noteSchema],
    communicationHistory: [communicationSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
