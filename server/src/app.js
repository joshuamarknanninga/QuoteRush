const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { successResponse } = require('./utils/apiResponse');
const requireAuth = require('./middleware/auth');
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const publicRoutes = require('./routes/publicRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Explicit CORS headers for local development reliability.
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }

  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

app.use(cors({ origin: 'http://localhost:4173' }));
// app.use(
//   cors({
//     origin: true,
//     credentials: true
//   })
// );
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
