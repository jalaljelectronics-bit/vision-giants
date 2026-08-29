const dashboard = require('../queries/dashboard');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getStats = asyncHandler(async (req, res) => {
  const stats = await dashboard.getStats();

  return ApiResponse.success(res, stats);
});