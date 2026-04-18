const jwt = require('jsonwebtoken');
const env = require('../config/env');

const createAuthToken = (userId) => jwt.sign({ userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

const attachAuthCookie = (res, token) => {
  res.cookie(env.cookieName, token, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7
  });
};

const clearAuthCookie = (res) => {
  res.clearCookie(env.cookieName);
};

module.exports = {
  createAuthToken,
  attachAuthCookie,
  clearAuthCookie
};
