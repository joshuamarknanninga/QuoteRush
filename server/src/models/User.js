const mongoose = require('mongoose');

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
    stripeCustomerId: { type: String, default: null },
    stripeSubscriptionId: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
