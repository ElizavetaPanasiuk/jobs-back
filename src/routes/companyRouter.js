const Router = require('express');

const companyController = require('../controllers/companyController');

const router = new Router();

router.get('/', companyController.getAll);

module.exports = router;