const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const { errorResponse } = require('../utils/apiResponse');

const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies[env.cookieName] || (req.headers.authorization || '').replace('Bearer ', '');

    if (!token) {
      return res.status(401).json(errorResponse('Unauthorized'));
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.userId).select('-passwordHash');

    if (!user) {
      return res.status(401).json(errorResponse('Unauthorized'));
    }

    req.user = user;
    next();
  } catch (_err) {
    return res.status(401).json(errorResponse('Invalid or expired token'));
  }
};

module.exports = requireAuth;
