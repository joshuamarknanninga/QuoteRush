const dotenv = require('dotenv');

dotenv.config();

const defaultClientOrigins = ['http://localhost:4173', 'http://localhost:5173'];

const clientOrigins = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(',').map((origin) => origin.trim()).filter(Boolean)
  : process.env.CLIENT_URL
    ? [process.env.CLIENT_URL.trim()]
    : defaultClientOrigins;

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  clientUrl: clientOrigins[0],
  clientOrigins,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quoterush',
  jwtSecret: process.env.JWT_SECRET || 'development_only_secret_change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieName: process.env.COOKIE_NAME || 'quoterush_token',
  cookieSecure: String(process.env.COOKIE_SECURE) === 'true',
  twilio: {
    sid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromNumber: process.env.TWILIO_FROM_NUMBER
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    priceId: process.env.STRIPE_PRICE_ID,
    successUrl: process.env.STRIPE_SUCCESS_URL,
    cancelUrl: process.env.STRIPE_CANCEL_URL
  },
  trialDays: Number(process.env.TRIAL_DAYS) || 14,
  automationPollMs: Number(process.env.AUTOMATION_POLL_MS) || 15000
};
