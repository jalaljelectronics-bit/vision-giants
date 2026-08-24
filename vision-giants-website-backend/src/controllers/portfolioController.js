const portfolio = require('../queries/portfolio');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => {
  const { rows } = await portfolio.getAll();
  ApiResponse.success(res, rows);
});

exports.getOne = asyncHandler(async (req, res) => {
  const { rows } = await portfolio.getBySlug(req.params.slug);
  if (!rows.length) return ApiResponse.error(res, 'Portfolio item not found', 404);
  ApiResponse.success(res, rows[0]);
});

exports.create = asyncHandler(async (req, res) => {
  const { rows } = await portfolio.create(req.body);
  ApiResponse.success(res, rows[0], 201);
});

exports.update = asyncHandler(async (req, res) => {
  const { rows } = await portfolio.update(req.params.id, req.body);
  if (!rows.length) return ApiResponse.error(res, 'Portfolio item not found', 404);
  ApiResponse.success(res, rows[0]);
});

exports.remove = asyncHandler(async (req, res) => {
  await portfolio.remove(req.params.id);
  ApiResponse.success(res, { deleted: true });
});