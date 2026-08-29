const router = require('express').Router();
const ctrl = require('../controllers/authController');
const validate = require('../middleware/validate');
const { loginSchema } = require('../schemas/auth');
const rateLimiter = require('../middleware/rateLimiter');
const requireAuth = require('../middleware/auth');

router.post('/login', rateLimiter, validate(loginSchema), ctrl.login);
router.post('/logout', ctrl.logout);
router.get('/me', requireAuth, ctrl.me);

module.exports = router;