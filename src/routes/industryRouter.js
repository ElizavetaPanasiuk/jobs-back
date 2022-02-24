const Router = require('express');

const industryController = require('../controllers/industryController');
const authMiddleware = require('../middleware/authMiddleware');

const router = new Router();

router.get('/', authMiddleware, industryController.getAll);

module.exports = router;