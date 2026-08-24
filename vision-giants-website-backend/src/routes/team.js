const router = require('express').Router();
const ctrl = require('../controllers/teamController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const teamSchema = require('../schemas/team');

router.get('/', ctrl.list);
router.post('/', auth, validate(teamSchema), ctrl.create);
router.put('/:id', auth, validate(teamSchema), ctrl.update);
router.delete('/:id', auth, ctrl.remove);
module.exports = router;