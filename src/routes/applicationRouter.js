const Router = require('express');

const ROLES = require('../constants/roles');

const applicationController = require('../controllers/applicationsController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

const router = new Router();

router.get('/', authMiddleware, applicationController.getAll);
router.get('/candidateData/:id', authMiddleware, applicationController.getApplicationCandidateData);
router.get('/letters/:id', authMiddleware, applicationController.getApplicationLetters);
router.post('/apply', checkRoleMiddleware(ROLES.candidate), applicationController.apply);
router.put('/approve', checkRoleMiddleware(ROLES.recruiter), applicationController.approve);
router.put('/reject', checkRoleMiddleware(ROLES.recruiter), applicationController.reject);

module.exports = router;