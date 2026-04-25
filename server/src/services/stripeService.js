const Stripe = require('stripe');
const env = require('../config/env');

const stripe = env.stripe.secretKey ? new Stripe(env.stripe.secretKey) : null;

const isStripeConfigured = () => Boolean(stripe && env.stripe.priceId);

const getDefaultSuccessUrl = () => `${env.clientUrl}/app/settings?billing=success`;
const getDefaultCancelUrl = () => `${env.clientUrl}/app/settings?billing=cancel`;

module.exports = {
  stripe,
  isStripeConfigured,
  getDefaultSuccessUrl,
  getDefaultCancelUrl
};
