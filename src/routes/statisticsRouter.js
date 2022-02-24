const Router = require('express');

const statisticsController = require('../controllers/statisticsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = new Router();

router.get('/', authMiddleware, statisticsController.getStatistics);

module.exports = router;