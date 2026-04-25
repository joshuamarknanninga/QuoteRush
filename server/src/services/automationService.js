const AutomationJob = require('../models/AutomationJob');
const BusinessSettings = require('../models/BusinessSettings');

const addHours = (date, hours) => {
  const next = new Date(date);
  next.setHours(next.getHours() + hours);
  return next;
};

const scheduleLeadCreatedJobs = async (lead) => {
  await AutomationJob.create({
    owner: lead.owner,
    lead: lead._id,
    type: 'lead_confirmation',
    scheduledFor: new Date(),
    payload: {}
  });
};

const scheduleStatusTransitionJobs = async (lead, previousStatus) => {
  if (lead.status === previousStatus) return;

  const settings = await BusinessSettings.findOne({ owner: lead.owner });
  const followupHours = settings?.defaultFollowupHours || 48;
  const reminderHours = settings?.defaultReminderHours || 24;

  if (lead.status === 'quoted') {
    await AutomationJob.create({
      owner: lead.owner,
      lead: lead._id,
      type: 'quote_followup',
      scheduledFor: addHours(new Date(), followupHours),
      payload: { followupHours }
    });
  }

  if (lead.status === 'booked') {
    const preferredDate = lead.preferredDate ? new Date(lead.preferredDate) : addHours(new Date(), reminderHours);
    await AutomationJob.create({
      owner: lead.owner,
      lead: lead._id,
      type: 'appointment_reminder',
      scheduledFor: addHours(preferredDate, -reminderHours),
      payload: { reminderHours }
    });
  }

  if (lead.status === 'completed') {
    await AutomationJob.create({
      owner: lead.owner,
      lead: lead._id,
      type: 'review_request',
      scheduledFor: addHours(new Date(), 2),
      payload: {}
    });
  }
};

module.exports = {
  scheduleLeadCreatedJobs,
  scheduleStatusTransitionJobs
};
