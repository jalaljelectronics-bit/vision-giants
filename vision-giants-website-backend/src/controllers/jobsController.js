const jobs = require('../queries/jobs');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.listPublic = asyncHandler(async (req, res) => ApiResponse.success(res, (await jobs.getActive()).rows));
exports.listAdmin = asyncHandler(async (req, res) => ApiResponse.success(res, (await jobs.getAllAdmin()).rows));
exports.getOne = asyncHandler(async (req, res) => {
  const { rows } = await jobs.getBySlug(req.params.slug);
  if (!rows.length) return ApiResponse.error(res, 'Job not found', 404);
  ApiResponse.success(res, rows[0]);
});
exports.create = asyncHandler(async (req, res) => ApiResponse.success(res, (await jobs.create(req.body)).rows[0], 201));
exports.update = asyncHandler(async (req, res) => {
  const { rows } = await jobs.update(req.params.id, req.body);
  if (!rows.length) return ApiResponse.error(res, 'Job not found', 404);
  ApiResponse.success(res, rows[0]);
});
exports.remove = asyncHandler(async (req, res) => { await jobs.remove(req.params.id); ApiResponse.success(res, { deleted: true }); });