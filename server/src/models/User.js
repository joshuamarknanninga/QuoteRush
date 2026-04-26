const mongoose = require('mongoose');
const env = require('../config/env');

const getDefaultTrialEndDate = () => {
  const days = Math.max(0, env.trialDays || 14);
  const trialEndDate = new Date();
  trialEndDate.setUTCDate(trialEndDate.getUTCDate() + days);
  return trialEndDate;
};

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    businessName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'owner', enum: ['owner', 'admin', 'staff'] },
    subscriptionStatus: {
      type: String,
      enum: ['trialing', 'active', 'past_due', 'canceled', 'incomplete'],
      default: 'trialing'
    },
    trialEndsAt: { type: Date, default: getDefaultTrialEndDate },
    stripeCustomerId: { type: String, default: null },
    stripeSubscriptionId: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
