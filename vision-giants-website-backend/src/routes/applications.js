const router = require('express').Router();
const ctrl = require('../controllers/applicationsController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const rateLimiter = require('../middleware/rateLimiter');
const applicationSchema = require('../schemas/application');

router.get('/', auth, ctrl.list);                                    // admin only — applicant data
router.post('/', rateLimiter, validate(applicationSchema), ctrl.create); // public, rate-limited
router.delete('/:id', auth, ctrl.remove);
module.exports = router;