
const router = require('express').Router();

const ctrl = require('../controllers/leadsController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const rateLimiter = require('../middleware/rateLimiter');
const leadSchema = require('../schemas/lead');

router.get(
  '/',
  auth,
  ctrl.list
);

router.post(
  '/',
  rateLimiter,
  validate(leadSchema),
  ctrl.create
);

router.patch(
  '/:id/status',
  auth,
  ctrl.updateStatus
);

router.delete(
  '/:id',
  auth,
  ctrl.remove
);

module.exports = router;

