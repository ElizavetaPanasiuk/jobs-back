const Router = require('express');
const ROLES = require('../constants/roles');

const recruiterController = require('../controllers/recruiterConstroller');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

const router = new Router();

router.get('/', checkRoleMiddleware(ROLES.company), recruiterController.getCompanyRecruiters);

module.exports = router;