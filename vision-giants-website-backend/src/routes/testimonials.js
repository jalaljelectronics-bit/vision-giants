const router = require('express').Router();
const ctrl = require('../controllers/testimonialsController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const testimonialSchema = require('../schemas/testimonial');

router.get('/', ctrl.list);
router.post('/', auth, validate(testimonialSchema), ctrl.create);
router.put('/:id', auth, validate(testimonialSchema), ctrl.update);
router.delete('/:id', auth, ctrl.remove);
module.exports = router;