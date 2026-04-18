const AutomationJob = require('../models/AutomationJob');
const Lead = require('../models/Lead');
const { sendSms } = require('../services/smsService');
const { sendEmail } = require('../services/emailService');
const { logMessage } = require('../services/messageLogger');
const env = require('../config/env');

const buildMessageForJob = (job, lead) => {
  switch (job.type) {
    case 'lead_confirmation':
      return `Thanks ${lead.customerName}, we received your quote request for ${lead.serviceType}.`;
    case 'quote_followup':
      return `Hi ${lead.customerName}, following up on your quote from QuoteRush.`;
    case 'appointment_reminder':
      return `Reminder: your ${lead.serviceType} appointment is coming up.`;
    case 'review_request':
      return `Thanks for your business ${lead.customerName}. We'd love your review.`;
    default:
      return 'QuoteRush update.';
  }
};

const processJob = async (job) => {
  const lead = await Lead.findOne({ _id: job.lead, owner: job.owner });
  if (!lead) {
    job.status = 'failed';
    job.lastError = 'Lead not found';
    await job.save();
    return;
  }

  try {
    job.status = 'processing';
    await job.save();

    const message = buildMessageForJob(job, lead);
    let delivery;

    if (lead.customerPhone) {
      delivery = await sendSms({ to: lead.customerPhone, body: message });
      await logMessage({
        owner: job.owner,
        lead: lead._id,
        channel: 'sms',
        direction: 'outbound',
        body: message,
        status: delivery.status
      });
    } else if (lead.customerEmail) {
      delivery = await sendEmail({ to: lead.customerEmail, subject: 'QuoteRush update', body: message });
      await logMessage({
        owner: job.owner,
        lead: lead._id,
        channel: 'email',
        direction: 'outbound',
        body: message,
        status: delivery.status
      });
    } else {
      delivery = { status: 'failed', info: 'No customer contact info available' };
    }

    lead.communicationHistory.push({
      channel: lead.customerPhone ? 'sms' : 'email',
      direction: 'outbound',
      body: message,
      status: delivery.status,
      sentAt: new Date()
    });
    await lead.save();

    job.status = delivery.status === 'failed' ? 'failed' : 'completed';
    job.lastError = delivery.status === 'failed' ? delivery.info : '';
    await job.save();
  } catch (error) {
    job.status = 'failed';
    job.lastError = error.message;
    await job.save();
  }
};

const startAutomationRunner = () => {
  setInterval(async () => {
    const jobs = await AutomationJob.find({
      status: 'pending',
      scheduledFor: { $lte: new Date() }
    })
      .sort({ scheduledFor: 1 })
      .limit(10);

    for (const job of jobs) {
      await processJob(job);
    }
  }, env.automationPollMs);
};

module.exports = startAutomationRunner;
