const testimonials = require('../queries/testimonials');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { revalidatePaths } = require('../utils/revalidate');

exports.list = asyncHandler(async (req, res) => ApiResponse.success(res, (await testimonials.getAll()).rows));

exports.create = asyncHandler(async (req, res) => {
  const { rows } = await testimonials.create(req.body);

  revalidatePaths(['/']);

  ApiResponse.success(res, rows[0], 201);
});

exports.update = asyncHandler(async (req, res) => {
  const { rows } = await testimonials.update(req.params.id, req.body);
  if (!rows.length) return ApiResponse.error(res, 'Testimonial not found', 404);

  revalidatePaths(['/']);

  ApiResponse.success(res, rows[0]);
});

exports.remove = asyncHandler(async (req, res) => {
  await testimonials.remove(req.params.id);

  revalidatePaths(['/']);

  ApiResponse.success(res, { deleted: true });
});