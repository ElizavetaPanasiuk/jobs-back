const Router = require('express');

const applicationRouter = require('./applicationRouter');
const companyRouter = require('./companyRouter');
const jobRouter = require('./jobRouter');
const industryRouter = require('./industryRouter');
const userRouter = require('./userRouter');
const statisticsRouter = require('./statisticsRouter');
const profileRouter = require('./profileRouter');
const recruiterRouter = require('./recruiterRouter');

const router = new Router();

router.use('/application', applicationRouter);
router.use('/company', companyRouter);
router.use('/job', jobRouter);
router.use('/industry', industryRouter);
router.use('/user', userRouter);
router.use('/statistics', statisticsRouter);
router.use('/profile', profileRouter);
router.use('/recruiter', recruiterRouter);

module.exports = router;

