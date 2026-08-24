const services = require('../queries/services');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => {
  const { rows } = await services.getAll();
  ApiResponse.success(res, rows);
});

exports.getOne = asyncHandler(async (req, res) => {
  const { rows } = await services.getBySlug(req.params.slug);
  if (!rows.length) return ApiResponse.error(res, 'Service not found', 404);
  ApiResponse.success(res, rows[0]);
});

exports.create = asyncHandler(async (req, res) => {
  const { rows } = await services.create(req.body);
  ApiResponse.success(res, rows[0], 201);
});

exports.update = asyncHandler(async (req, res) => {
  const { rows } = await services.update(req.params.id, req.body);
  if (!rows.length) return ApiResponse.error(res, 'Service not found', 404);
  ApiResponse.success(res, rows[0]);
});

exports.remove = asyncHandler(async (req, res) => {
  await services.remove(req.params.id);
  ApiResponse.success(res, { deleted: true });
});