const blog = require('../queries/blog');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Public — only published posts
exports.listPublic = asyncHandler(async (req, res) => {
  const { rows } = await blog.getPublished();
  ApiResponse.success(res, rows);
});

// Admin — everything including drafts
exports.listAdmin = asyncHandler(async (req, res) => {
  const { rows } = await blog.getAllAdmin();
  ApiResponse.success(res, rows);
});

exports.getOne = asyncHandler(async (req, res) => {
  const { rows } = await blog.getBySlug(req.params.slug);
  if (!rows.length) return ApiResponse.error(res, 'Post not found', 404);
  ApiResponse.success(res, rows[0]);
});

exports.create = asyncHandler(async (req, res) => {
  const { rows } = await blog.create(req.body);
  ApiResponse.success(res, rows[0], 201);
});

exports.update = asyncHandler(async (req, res) => {
  const existing = await blog.getBySlug(req.params.slug || '');
  const { rows: current } = await require('../db').query('SELECT published FROM blog_posts WHERE id = $1', [req.params.id]);
  const wasPublished = current[0]?.published || false;
  const { rows } = await blog.update(req.params.id, req.body, wasPublished);
  if (!rows.length) return ApiResponse.error(res, 'Post not found', 404);
  ApiResponse.success(res, rows[0]);
});

exports.remove = asyncHandler(async (req, res) => {
  await blog.remove(req.params.id);
  ApiResponse.success(res, { deleted: true });
});