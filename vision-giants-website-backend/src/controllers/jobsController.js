const jobs = require('../queries/jobs');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { revalidatePaths } = require('../utils/revalidate');
const { query } = require('../db');

exports.listPublic = asyncHandler(async (req, res) => ApiResponse.success(res, (await jobs.getActive()).rows));
exports.listAdmin = asyncHandler(async (req, res) => ApiResponse.success(res, (await jobs.getAllAdmin()).rows));

exports.getOne = asyncHandler(async (req, res) => {
  const { rows } = await jobs.getBySlug(req.params.slug);
  if (!rows.length) return ApiResponse.error(res, 'Job not found', 404);
  ApiResponse.success(res, rows[0]);
});

exports.create = asyncHandler(async (req, res) => {
  const { rows } = await jobs.create(req.body);
  const job = rows[0];

  revalidatePaths(['/careers', `/careers/${job.slug}`]);

  ApiResponse.success(res, job, 201);
});

exports.update = asyncHandler(async (req, res) => {
  const { rows } = await jobs.update(req.params.id, req.body);
  if (!rows.length) return ApiResponse.error(res, 'Job not found', 404);

  const job = rows[0];

  revalidatePaths(['/careers', `/careers/${job.slug}`]);

  ApiResponse.success(res, job);
});

exports.remove = asyncHandler(async (req, res) => {
  const { rows } = await query('SELECT slug FROM job_postings WHERE id = $1', [req.params.id]);
  const slug = rows[0]?.slug;

  await jobs.remove(req.params.id);

  const paths = slug ? ['/careers', `/careers/${slug}`] : ['/careers'];
  revalidatePaths(paths);

  ApiResponse.success(res, { deleted: true });
});