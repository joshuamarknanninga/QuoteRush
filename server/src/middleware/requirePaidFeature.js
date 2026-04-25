const { errorResponse } = require('../utils/apiResponse');

const allowedStatuses = new Set(['trialing', 'active']);

module.exports = (req, res, next) => {
  const status = req.user.subscriptionStatus || 'trialing';

  if (allowedStatuses.has(status)) {
    return next();
  }

  return res.status(402).json(errorResponse('An active subscription is required to access this feature.', {
    subscriptionStatus: status
  }));
};
