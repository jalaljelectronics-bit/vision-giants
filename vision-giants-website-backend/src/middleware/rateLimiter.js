const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, data: null, error: 'Too many requests, try again later' },
});