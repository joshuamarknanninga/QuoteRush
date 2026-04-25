const successResponse = (message, data = null) => ({
  success: true,
  message,
  data
});

const errorResponse = (message, data = null) => ({
  success: false,
  message,
  data
});

module.exports = {
  successResponse,
  errorResponse
};
