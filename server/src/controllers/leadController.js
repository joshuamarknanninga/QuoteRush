const Lead = require('../models/Lead');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const BusinessSettings = require('../models/BusinessSettings');
const { scheduleLeadCreatedJobs, scheduleStatusTransitionJobs } = require('../services/automationService');

const createLead = async (req, res, next) => {
  try {
    const payload = {
      owner: req.user._id,
      customerName: req.body.customerName,
      customerPhone: req.body.customerPhone || '',
      customerEmail: req.body.customerEmail || '',
      address: req.body.address || '',
      serviceType: req.body.serviceType,
      preferredDate: req.body.preferredDate || null,
      message: req.body.message || '',
      quoteAmount: req.body.quoteAmount || 0,
      status: req.body.status || 'new',
      images: req.body.images || []
    };

    const lead = await Lead.create(payload);
    await scheduleLeadCreatedJobs(lead);

    return res.status(201).json(successResponse('Lead created successfully', { lead }));
  } catch (error) {
    next(error);
  }
};

const getLeads = async (req, res, next) => {
  try {
    const { status, q } = req.query;
    const filter = { owner: req.user._id };

    if (status) {
      filter.status = status;
    }

    if (q) {
      filter.$or = [
        { customerName: { $regex: q, $options: 'i' } },
        { customerEmail: { $regex: q, $options: 'i' } },
        { serviceType: { $regex: q, $options: 'i' } }
      ];
    }

    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    return res.json(successResponse('Leads fetched successfully', { leads }));
  } catch (error) {
    next(error);
  }
};

const getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
    if (!lead) {
      return res.status(404).json(errorResponse('Lead not found'));
    }

    return res.json(successResponse('Lead fetched successfully', { lead }));
  } catch (error) {
    next(error);
  }
};

const updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
    if (!lead) {
      return res.status(404).json(errorResponse('Lead not found'));
    }

    const previousStatus = lead.status;
    const allowedFields = [
      'customerName',
      'customerPhone',
      'customerEmail',
      'address',
      'serviceType',
      'preferredDate',
      'message',
      'images',
      'status',
      'quoteAmount'
    ];

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        lead[field] = req.body[field];
      }
    }

    await lead.save();
    await scheduleStatusTransitionJobs(lead, previousStatus);

    return res.json(successResponse('Lead updated successfully', { lead }));
  } catch (error) {
    next(error);
  }
};

const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!lead) {
      return res.status(404).json(errorResponse('Lead not found'));
    }

    return res.json(successResponse('Lead deleted successfully'));
  } catch (error) {
    next(error);
  }
};

const addNote = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
    if (!lead) {
      return res.status(404).json(errorResponse('Lead not found'));
    }

    lead.notes.push({ body: req.body.body, authorName: req.user.name });
    await lead.save();

    return res.json(successResponse('Note added successfully', { lead }));
  } catch (error) {
    next(error);
  }
};


const createPublicLead = async (req, res, next) => {
  try {
    const settings = await BusinessSettings.findOne({ intakeFormSlug: req.params.slug });
    if (!settings) {
      return res.status(404).json(errorResponse('Business intake form not found'));
    }

    const lead = await Lead.create({
      owner: settings.owner,
      customerName: req.body.customerName,
      customerPhone: req.body.customerPhone || '',
      customerEmail: req.body.customerEmail || '',
      address: req.body.address || '',
      serviceType: req.body.serviceType,
      preferredDate: req.body.preferredDate || null,
      message: req.body.message || '',
      images: req.body.images || [],
      status: 'new',
      quoteAmount: 0
    });

    await scheduleLeadCreatedJobs(lead);

    return res.status(201).json(successResponse('Quote request submitted successfully', { leadId: lead._id }));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  addNote,
  createPublicLead
};
