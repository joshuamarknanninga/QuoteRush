const BusinessSettings = require('../models/BusinessSettings');
const { successResponse } = require('../utils/apiResponse');

const getSettings = async (req, res, next) => {
  try {
    const settings = await BusinessSettings.findOne({ owner: req.user._id });
    return res.json(successResponse('Settings fetched successfully', { settings }));
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const updates = {
      businessPhone: req.body.businessPhone,
      businessEmail: req.body.businessEmail,
      reviewLink: req.body.reviewLink,
      defaultReminderHours: req.body.defaultReminderHours,
      defaultFollowupHours: req.body.defaultFollowupHours,
      intakeFormSlug: req.body.intakeFormSlug
    };

    Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

    const settings = await BusinessSettings.findOneAndUpdate(
      { owner: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.json(successResponse('Settings updated successfully', { settings }));
  } catch (error) {
    next(error);
  }
};

const getPublicSettingsBySlug = async (req, res, next) => {
  try {
    const settings = await BusinessSettings.findOne({ intakeFormSlug: req.params.slug }).populate('owner', 'businessName');

    return res.json(
      successResponse('Public settings fetched', {
        settings: settings
          ? {
              businessName: settings.owner.businessName,
              businessPhone: settings.businessPhone,
              businessEmail: settings.businessEmail,
              intakeFormSlug: settings.intakeFormSlug
            }
          : null
      })
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { getSettings, updateSettings, getPublicSettingsBySlug };
