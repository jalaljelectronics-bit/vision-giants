
const leads = require('../queries/leads');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => {
  const { rows } = await leads.getAll();

  return ApiResponse.success(res, rows);
});

exports.create = asyncHandler(async (req, res) => {
  const { rows } = await leads.create(req.body);

  return ApiResponse.success(res, rows[0], 201);
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const { rows } = await leads.updateStatus(
    req.params.id,
    req.body.status
  );

  if (!rows.length) {
    return ApiResponse.error(res, 'Lead not found', 404);
  }

  return ApiResponse.success(res, rows[0]);
});

exports.remove = asyncHandler(async (req, res) => {
  const { rows } = await leads.remove(req.params.id);

  if (!rows.length) {
    return ApiResponse.error(res, 'Lead not found', 404);
  }

  return ApiResponse.success(res, rows[0]);
});

