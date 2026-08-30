const portfolio = require('../queries/portfolio');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { revalidatePaths } = require('../utils/revalidate');

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
  const item = rows[0];

  revalidatePaths(['/portfolio', `/portfolio/${item.slug}`]);

  ApiResponse.success(res, item, 201);
});

exports.update = asyncHandler(async (req, res) => {
  const { rows } = await portfolio.update(req.params.id, req.body);
  if (!rows.length) return ApiResponse.error(res, 'Portfolio item not found', 404);

  const item = rows[0];

  revalidatePaths(['/portfolio', `/portfolio/${item.slug}`]);

  ApiResponse.success(res, item);
});

exports.remove = asyncHandler(async (req, res) => {
  await portfolio.remove(req.params.id);

  revalidatePaths(['/portfolio']);

  ApiResponse.success(res, { deleted: true });
});