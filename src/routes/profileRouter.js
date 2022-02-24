const Router = require('express');
const router = new Router();
const ProfileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, ProfileController.get);
router.put('/', authMiddleware, ProfileController.update);

module.exports = router;