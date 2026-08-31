const services = require('../queries/services');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { revalidatePaths } = require('../utils/revalidate');

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
  const { rows: dupes } = await services.getBySlug(req.body.slug);
  if (dupes.length) {
    return ApiResponse.error(res, 'That slug is already in use', 409);
  }

  const { rows } = await services.create(req.body);
  const service = rows[0];

  revalidatePaths(['/services', `/services/${service.slug}`]);

  ApiResponse.success(res, service, 201);
});

exports.update = asyncHandler(async (req, res) => {
  const { rows: existingRows } = await services.getById(req.params.id);
  if (!existingRows.length) return ApiResponse.error(res, 'Service not found', 404);
  const oldSlug = existingRows[0].slug;

  if (req.body.slug && req.body.slug !== oldSlug) {
    const { rows: dupes } = await services.getBySlug(req.body.slug);
    if (dupes.length) {
      return ApiResponse.error(res, 'That slug is already in use', 409);
    }
  }

  const { rows } = await services.update(req.params.id, req.body);
  if (!rows.length) return ApiResponse.error(res, 'Service not found', 404);

  const service = rows[0];

  const paths = ['/services', `/services/${service.slug}`];
  if (oldSlug !== service.slug) paths.push(`/services/${oldSlug}`);
  revalidatePaths(paths);

  ApiResponse.success(res, service);
});

exports.remove = asyncHandler(async (req, res) => {
  await services.remove(req.params.id);

  revalidatePaths(['/services']);

  ApiResponse.success(res, { deleted: true });
});