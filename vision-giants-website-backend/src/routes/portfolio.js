const router = require('express').Router();
const ctrl = require('../controllers/portfolioController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const portfolioSchema = require('../schemas/portfolio');

router.get('/', ctrl.list);
router.get('/:slug', ctrl.getOne);
router.post('/', auth, validate(portfolioSchema), ctrl.create);
router.put('/:id', auth, validate(portfolioSchema), ctrl.update);
router.delete('/:id', auth, ctrl.remove);

module.exports = router;