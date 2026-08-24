const router = require('express').Router();
const ctrl = require('../controllers/blogController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const blogSchema = require('../schemas/blog');

router.get('/', ctrl.listPublic);           // public — published only
router.get('/admin/all', auth, ctrl.listAdmin); // admin — drafts + published
router.get('/:slug', ctrl.getOne);
router.post('/', auth, validate(blogSchema), ctrl.create);
router.put('/:id', auth, validate(blogSchema), ctrl.update);
router.delete('/:id', auth, ctrl.remove);

module.exports = router;