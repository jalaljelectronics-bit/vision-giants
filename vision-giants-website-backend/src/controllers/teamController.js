const team = require('../queries/team');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { revalidatePaths } = require('../utils/revalidate');

exports.list = asyncHandler(async (req, res) => ApiResponse.success(res, (await team.getAll()).rows));

exports.create = asyncHandler(async (req, res) => {
  const { rows } = await team.create(req.body);

  revalidatePaths(['/about']);

  ApiResponse.success(res, rows[0], 201);
});

exports.update = asyncHandler(async (req, res) => {
  const { rows } = await team.update(req.params.id, req.body);
  if (!rows.length) return ApiResponse.error(res, 'Team member not found', 404);

  revalidatePaths(['/about']);

  ApiResponse.success(res, rows[0]);
});

exports.remove = asyncHandler(async (req, res) => {
  await team.remove(req.params.id);

  revalidatePaths(['/about']);

  ApiResponse.success(res, { deleted: true });
});