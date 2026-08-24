const router = require('express').Router();
const ctrl = require('../controllers/jobsController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const jobSchema = require('../schemas/job');

router.get('/', ctrl.listPublic);
router.get('/admin/all', auth, ctrl.listAdmin);
router.get('/:slug', ctrl.getOne);
router.post('/', auth, validate(jobSchema), ctrl.create);
router.put('/:id', auth, validate(jobSchema), ctrl.update);
router.delete('/:id', auth, ctrl.remove);
module.exports = router;