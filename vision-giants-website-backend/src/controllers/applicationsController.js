const applications = require('../queries/applications');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => {
  const result = await applications.getAll();
  return ApiResponse.success(res, result.rows);
});

exports.getById = asyncHandler(async (req, res) => {
  const result = await applications.getById(req.params.id);
  if (!result.rows[0]) {
    return ApiResponse.notFound(res, 'Application not found');
  }
  return ApiResponse.success(res, result.rows[0]);
});

exports.create = asyncHandler(async (req, res) => {
  const result = await applications.create(req.body);
  return ApiResponse.success(res, result.rows[0], 201);
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const result = await applications.updateStatus(req.params.id, status);
  if (!result.rows[0]) {
    return ApiResponse.notFound(res, 'Application not found');
  }
  return ApiResponse.success(res, result.rows[0]);
});

exports.remove = asyncHandler(async (req, res) => {
  await applications.remove(req.params.id);
  return ApiResponse.success(res, { deleted: true });
});