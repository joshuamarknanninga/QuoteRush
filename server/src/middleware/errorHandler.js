const { errorResponse } = require('../utils/apiResponse');

const notFound = (_req, res) => {
  res.status(404).json(errorResponse('Route not found'));
};

const errorHandler = (err, _req, res, _next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json(errorResponse(message, process.env.NODE_ENV === 'development' ? err.stack : null));
};

module.exports = {
  notFound,
  errorHandler
};
