const blog = require('../queries/blog');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { revalidatePaths } = require('../utils/revalidate');
const { query } = require('../db');

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
  const post = rows[0];

  revalidatePaths(['/blog', `/blog/${post.slug}`]);

  ApiResponse.success(res, post, 201);
});

exports.update = asyncHandler(async (req, res) => {
  const existing = await blog.getBySlug(req.params.slug || '');
  const { rows: current } = await query('SELECT published FROM blog_posts WHERE id = $1', [req.params.id]);
  const wasPublished = current[0]?.published || false;
  const { rows } = await blog.update(req.params.id, req.body, wasPublished);
  if (!rows.length) return ApiResponse.error(res, 'Post not found', 404);

  const post = rows[0];

  revalidatePaths(['/blog', `/blog/${post.slug}`]);

  ApiResponse.success(res, post);
});

exports.remove = asyncHandler(async (req, res) => {
  const { rows } = await query('SELECT slug FROM blog_posts WHERE id = $1', [req.params.id]);
  const slug = rows[0]?.slug;

  await blog.remove(req.params.id);

  const paths = slug ? ['/blog', `/blog/${slug}`] : ['/blog'];
  revalidatePaths(paths);

  ApiResponse.success(res, { deleted: true });
});