const jwt = require('jsonwebtoken');
const admins = require('../queries/admins');
const { compare } = require('../utils/hashPassword');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

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

  ApiResponse.success(res, { token, admin: { id: admin.id, email: admin.email, name: admin.name } });
});