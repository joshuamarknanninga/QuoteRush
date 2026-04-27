const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const env = require('../config/env');
const { stripe, isStripeConfigured, getDefaultSuccessUrl, getDefaultCancelUrl } = require('../services/stripeService');

const upsertStripeCustomer = async (user) => {
  if (!isStripeConfigured()) {
    return null;
  }

  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.businessName,
    metadata: { userId: user._id.toString() }
  });

  user.stripeCustomerId = customer.id;
  await user.save();

  return customer.id;
};

const createCheckoutSession = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!isStripeConfigured()) {
      if (env.nodeEnv === 'production') {
        return res.status(503).json(errorResponse('Stripe is not configured for this environment.'));
      }

      return res.json(successResponse('Stripe is not configured. Returning simulated checkout URL.', {
        checkoutUrl: `${env.clientUrl}/app/settings?billing=simulated`
      }));
    }

    const customerId = await upsertStripeCustomer(user);
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: env.stripe.priceId, quantity: 1 }],
      success_url: env.stripe.successUrl || getDefaultSuccessUrl(),
      cancel_url: env.stripe.cancelUrl || getDefaultCancelUrl(),
      allow_promotion_codes: true,
      metadata: { userId: user._id.toString() }
    });

    return res.json(successResponse('Checkout session created', { checkoutUrl: session.url }));
  } catch (error) {
    next(error);
  }
};

const createBillingPortalSession = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!isStripeConfigured() || !user.stripeCustomerId) {
      if (env.nodeEnv === 'production') {
        return res.status(503).json(errorResponse('Stripe billing portal is unavailable.'));
      }

      return res.json(successResponse('Stripe billing portal unavailable. Returning simulated URL.', {
        portalUrl: `${env.clientUrl}/app/settings?billing=portal-simulated`
      }));
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: env.clientUrl + '/app/settings'
    });

    return res.json(successResponse('Billing portal session created', { portalUrl: session.url }));
  } catch (error) {
    next(error);
  }
};

const mapStripeStatus = (status) => {
  if (!status) return 'incomplete';
  if (['active', 'trialing', 'past_due', 'canceled', 'incomplete'].includes(status)) return status;
  return 'incomplete';
};

const handleWebhook = async (req, res, next) => {
  try {
    if (!stripe || !env.stripe.webhookSecret) {
      return res.status(400).json(errorResponse('Stripe webhook is not configured.'));
    }

    const signature = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(req.body, signature, env.stripe.webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const updates = {
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription,
        subscriptionStatus: 'active'
      };

      if (userId) {
        await User.findByIdAndUpdate(userId, { $set: updates });
      } else {
        await User.findOneAndUpdate({ stripeCustomerId: session.customer }, { $set: updates });
      }
    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created' || event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;

      await User.findOneAndUpdate(
        { stripeCustomerId: subscription.customer },
        {
          $set: {
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: mapStripeStatus(subscription.status)
          }
        }
      );
    }

    return res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCheckoutSession,
  createBillingPortalSession,
  handleWebhook
};
