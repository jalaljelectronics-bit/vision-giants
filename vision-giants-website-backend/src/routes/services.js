const router = require('express').Router();
const ctrl = require('../controllers/servicesController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const serviceSchema = require('../schemas/service');

router.get('/', ctrl.list);
router.get('/:slug', ctrl.getOne);
router.post('/', auth, validate(serviceSchema), ctrl.create);
router.put('/:id', auth, validate(serviceSchema), ctrl.update);
router.delete('/:id', auth, ctrl.remove);

module.exports = router;