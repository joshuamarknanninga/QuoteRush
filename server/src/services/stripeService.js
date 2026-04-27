const env = require('../config/env');

const Stripe = env.stripe.secretKey ? require('stripe') : null;

const stripe = Stripe ? new Stripe(env.stripe.secretKey) : null;

const isStripeConfigured = () => Boolean(stripe && env.stripe.priceId);

const getDefaultSuccessUrl = () => `${env.clientUrl}/app/settings?billing=success`;
const getDefaultCancelUrl = () => `${env.clientUrl}/app/settings?billing=cancel`;

module.exports = {
  stripe,
  isStripeConfigured,
  getDefaultSuccessUrl,
  getDefaultCancelUrl
};
