const applications = require('../queries/applications');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => ApiResponse.success(res, (await applications.getAll()).rows)); // admin only
exports.create = asyncHandler(async (req, res) => ApiResponse.success(res, (await applications.create(req.body)).rows[0], 201)); // public
exports.remove = asyncHandler(async (req, res) => { await applications.remove(req.params.id); ApiResponse.success(res, { deleted: true }); });