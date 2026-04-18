const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const env = require('./config/env');
const { successResponse } = require('./utils/apiResponse');
const requireAuth = require('./middleware/auth');
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const publicRoutes = require('./routes/publicRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();


const localhostOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (env.nodeEnv === 'development') {
      return callback(null, true);
    }

    if (localhostOriginPattern.test(origin)) {
      return callback(null, true);
    }

    if (env.clientOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json(successResponse('QuoteRush API is healthy'));
});

app.use('/api/auth', authRoutes);
app.use('/api/leads', requireAuth, leadRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/settings', requireAuth, settingsRoutes);
app.use('/api/dashboard', requireAuth, dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
