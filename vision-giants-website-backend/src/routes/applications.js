const router = require('express').Router();
const ctrl = require('../controllers/applicationsController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const rateLimiter = require('../middleware/rateLimiter');
const applicationSchema = require('../schemas/application');

router.get('/', auth, ctrl.list);                                    // admin only — all applications
router.get('/:id/resume', ctrl.downloadResume);                      // download resume / redirect to signed URL
router.get('/:id', auth, ctrl.getById);                              // admin only — single application
router.post('/', rateLimiter, validate(applicationSchema), ctrl.create); // public, rate-limited
router.patch('/:id/status', auth, ctrl.updateStatus);                // admin only — update status
router.delete('/:id', auth, ctrl.remove);                             // admin only — delete application

module.exports = router;