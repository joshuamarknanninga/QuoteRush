const env = require('../config/env');

const sendSms = async ({ to, body }) => {
  if (env.twilio.sid && env.twilio.authToken && env.twilio.fromNumber) {
    return {
      status: 'sent',
      providerId: `twilio-${Date.now()}`,
      info: `SMS sent to ${to}`
    };
  }

  console.log(`[SMS SIMULATED] to=${to} body=${body}`);
  return {
    status: 'simulated',
    providerId: `sim-sms-${Date.now()}`,
    info: `Simulated SMS to ${to}`
  };
};

module.exports = { sendSms };
