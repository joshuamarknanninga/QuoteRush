const bcrypt = require('bcryptjs');
const { nanoid } = require('nanoid');
const User = require('../models/User');
const BusinessSettings = require('../models/BusinessSettings');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { createAuthToken, attachAuthCookie, clearAuthCookie } = require('../utils/authToken');

const register = async (req, res, next) => {
  try {
    const { name, businessName, email, password } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json(errorResponse('Email already in use'));
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, businessName, email: email.toLowerCase(), passwordHash, role: 'owner' });

    await BusinessSettings.create({
      owner: user._id,
      businessPhone: '',
      businessEmail: email.toLowerCase(),
      reviewLink: '',
      defaultReminderHours: 24,
      defaultFollowupHours: 48,
      intakeFormSlug: `${businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${nanoid(6)}`
    });

    const token = createAuthToken(user._id);
    attachAuthCookie(res, token);

    return res.status(201).json(
      successResponse('Registered successfully', {
        user: { id: user._id, name: user.name, email: user.email, businessName: user.businessName, role: user.role, subscriptionStatus: user.subscriptionStatus }
      })
    );
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json(errorResponse('Invalid credentials'));
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json(errorResponse('Invalid credentials'));
    }

    const token = createAuthToken(user._id);
    attachAuthCookie(res, token);

    return res.json(
      successResponse('Logged in successfully', {
        user: { id: user._id, name: user.name, email: user.email, businessName: user.businessName, role: user.role, subscriptionStatus: user.subscriptionStatus }
      })
    );
  } catch (error) {
    next(error);
  }
};

const logout = async (_req, res) => {
  clearAuthCookie(res);
  return res.json(successResponse('Logged out successfully'));
};

const me = async (req, res) => {
  return res.json(successResponse('User fetched', {
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      businessName: req.user.businessName,
      role: req.user.role,
      subscriptionStatus: req.user.subscriptionStatus
    }
  }));
};

module.exports = {
  register,
  login,
  logout,
  me
};
