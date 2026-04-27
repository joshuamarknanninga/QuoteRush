const { errorResponse } = require('../utils/apiResponse');

const allowedStatuses = new Set(['trialing', 'active']);

module.exports = (req, res, next) => {
  const status = req.user.subscriptionStatus || 'trialing';
  const trialEndsAt = req.user.trialEndsAt ? new Date(req.user.trialEndsAt) : null;
  const isExpiredTrial = status === 'trialing' && trialEndsAt && trialEndsAt.getTime() <= Date.now();

  if (allowedStatuses.has(status) && !isExpiredTrial) {
    return next();
  }

  return res.status(402).json(errorResponse('A paid subscription is required to access this feature.', {
    subscriptionStatus: status
  }));
};
