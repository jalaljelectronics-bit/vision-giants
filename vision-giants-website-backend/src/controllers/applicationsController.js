const applications = require('../queries/applications');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { getSignedResumeUrl } = require('../utils/cloudinary');

function formatApplication(app) {
  if (!app) return null;
  return {
    ...app,
    raw_resume_url: app.resume_url,
    resume_url: getSignedResumeUrl(app.resume_url),
  };
}

exports.list = asyncHandler(async (req, res) => {
  const result = await applications.getAll();
  const formatted = (result.rows || []).map(formatApplication);
  return ApiResponse.success(res, formatted);
});

exports.getById = asyncHandler(async (req, res) => {
  const result = await applications.getById(req.params.id);
  if (!result.rows[0]) {
    return ApiResponse.notFound(res, 'Application not found');
  }
  return ApiResponse.success(res, formatApplication(result.rows[0]));
});

exports.downloadResume = asyncHandler(async (req, res) => {
  const result = await applications.getById(req.params.id);
  const app = result.rows[0];
  if (!app || !app.resume_url) {
    return ApiResponse.notFound(res, 'Resume not found for this application');
  }
  const signedUrl = getSignedResumeUrl(app.resume_url);
  return res.redirect(signedUrl);
});

exports.create = asyncHandler(async (req, res) => {
  const result = await applications.create(req.body);
  return ApiResponse.success(res, formatApplication(result.rows[0]), 201);
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const result = await applications.updateStatus(req.params.id, status);
  if (!result.rows[0]) {
    return ApiResponse.notFound(res, 'Application not found');
  }
  return ApiResponse.success(res, formatApplication(result.rows[0]));
});

exports.remove = asyncHandler(async (req, res) => {
  await applications.remove(req.params.id);
  return ApiResponse.success(res, { deleted: true });
});