const mongoose = require('mongoose');

const businessSettingsSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    businessPhone: { type: String, trim: true, default: '' },
    businessEmail: { type: String, trim: true, lowercase: true, default: '' },
    reviewLink: { type: String, trim: true, default: '' },
    defaultReminderHours: { type: Number, default: 24, min: 1 },
    defaultFollowupHours: { type: Number, default: 48, min: 1 },
    intakeFormSlug: { type: String, required: true, unique: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('BusinessSettings', businessSettingsSchema);
