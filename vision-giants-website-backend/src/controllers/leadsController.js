const leads = require('../queries/leads');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => ApiResponse.success(res, (await leads.getAll()).rows)); // admin only
exports.create = asyncHandler(async (req, res) => ApiResponse.success(res, (await leads.create(req.body)).rows[0], 201)); // public
exports.updateStatus = asyncHandler(async (req, res) => {
  const { rows } = await leads.updateStatus(req.params.id, req.body.status);
  if (!rows.length) return ApiResponse.error(res, 'Lead not found', 404);
  ApiResponse.success(res, rows[0]);
});