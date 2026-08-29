const router = require('express').Router();

const ctrl = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

router.get('/dashboard-stats', auth, ctrl.getStats);

module.exports = router;