const router = require('express').Router();
const ctrl = require('../controllers/authController');
const validate = require('../middleware/validate');
const { loginSchema } = require('../schemas/auth');
const rateLimiter = require('../middleware/rateLimiter');

router.post('/login', rateLimiter, validate(loginSchema), ctrl.login);

module.exports = router;