const MessageLog = require('../models/MessageLog');

const logMessage = async ({ owner, lead, channel, direction, body, status }) => {
  const log = await MessageLog.create({
    owner,
    lead,
    channel,
    direction,
    body,
    status,
    sentAt: new Date()
  });

  return log;
};

module.exports = { logMessage };
