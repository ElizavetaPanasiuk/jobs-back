const Router = require('express');
const ROLES = require('../constants/roles');

const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

const router = new Router();

router.get('/', authMiddleware, jobController.getAll);
router.get('/recruiter-jobs', checkRoleMiddleware(ROLES.recruiter), jobController.getRecruiterJobList);
router.get('/company-jobs', checkRoleMiddleware(ROLES.company), jobController.getCompanyJobList);
router.get('/:id', authMiddleware, jobController.getJobById);
router.post('/', checkRoleMiddleware(ROLES.recruiter), jobController.create);
router.get('/recruiterData/:id', authMiddleware, jobController.getJobRecruiterData);

module.exports = router;