const bcrypt = require('bcryptjs');
const { nanoid } = require('nanoid');
const User = require('../models/User');
const BusinessSettings = require('../models/BusinessSettings');
const Lead = require('../models/Lead');
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
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          businessName: user.businessName,
          role: user.role,
          subscriptionStatus: user.subscriptionStatus,
          trialEndsAt: user.trialEndsAt
        }
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
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          businessName: user.businessName,
          role: user.role,
          subscriptionStatus: user.subscriptionStatus,
          trialEndsAt: user.trialEndsAt
        }
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
      subscriptionStatus: req.user.subscriptionStatus,
      trialEndsAt: req.user.trialEndsAt
    }
  }));
};

const demoLogin = async (_req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json(errorResponse('Route not found'));
    }

    const demoEmail = 'demo@quoterush.app';
    const demoPassword = 'DemoPass123!';
    const passwordHash = await bcrypt.hash(demoPassword, 12);

    let user = await User.findOne({ email: demoEmail });

    if (!user) {
      user = await User.create({
        name: 'Demo Owner',
        businessName: 'Rush Detail Co',
        email: demoEmail,
        passwordHash,
        role: 'owner',
        subscriptionStatus: 'active'
      });
    } else {
      user.subscriptionStatus = 'active';
      user.passwordHash = passwordHash;
      await user.save();
    }

    await BusinessSettings.findOneAndUpdate(
      { owner: user._id },
      {
        $set: {
          businessPhone: '(555) 111-2222',
          businessEmail: demoEmail,
          reviewLink: 'https://example.com/review',
          defaultReminderHours: 24,
          defaultFollowupHours: 48,
          intakeFormSlug: 'rush-detail-co-demo'
        }
      },
      { upsert: true, new: true }
    );

    const existingLeadCount = await Lead.countDocuments({ owner: user._id });
    if (existingLeadCount === 0) {
      await Lead.insertMany([
        {
          owner: user._id,
          customerName: 'Customer 1',
          customerPhone: '5550000001',
          customerEmail: 'customer1@mail.com',
          serviceType: 'Mobile Detailing',
          message: 'Need a quote this week.',
          status: 'new',
          quoteAmount: 120
        },
        {
          owner: user._id,
          customerName: 'Customer 2',
          customerPhone: '5550000002',
          customerEmail: 'customer2@mail.com',
          serviceType: 'Pressure Washing',
          message: 'Looking for an estimate.',
          status: 'quoted',
          quoteAmount: 220
        }
      ]);
    }

    const token = createAuthToken(user._id);
    attachAuthCookie(res, token);

    return res.json(successResponse('Demo session started', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        businessName: user.businessName,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
        trialEndsAt: user.trialEndsAt
      }
    }));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  me,
  demoLogin
};
