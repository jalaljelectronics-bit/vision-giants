const jwt = require('jsonwebtoken');
const admins = require('../queries/admins');
const { compare } = require('../utils/hashPassword');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { rows } = await admins.getByEmail(email);
  if (!rows.length) return ApiResponse.error(res, 'Invalid credentials', 401);

  const admin = rows[0];
  const valid = await compare(password, admin.password);
  if (!valid) return ApiResponse.error(res, 'Invalid credentials', 401);

  const token = jwt.sign(
    { id: admin.id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('admin_token', token, COOKIE_OPTIONS);

  ApiResponse.success(res, {
    admin: { id: admin.id, email: admin.email, name: admin.name },
  });
});

exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie('admin_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  ApiResponse.success(res, { message: 'Logged out' });
});

exports.me = asyncHandler(async (req, res) => {
  // req.admin is set by the auth middleware after verifying the cookie
  ApiResponse.success(res, { admin: req.admin });
});