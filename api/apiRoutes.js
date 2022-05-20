'use strict';
const router = require('express').Router();
const userRoutes = require('./user/userRoutes.js');
const tutorRoutes = require('./tutor/tutorRoutes.js');
const timelineRoutes = require('./timeline/timelineRoutes.js');

router.use('/user', userRoutes);
router.use('/tutor', tutorRoutes);
router.use('/timeline', timelineRoutes);

module.exports = router;
