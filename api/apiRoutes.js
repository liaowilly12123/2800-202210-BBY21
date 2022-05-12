'use strict';
const router = require('express').Router();
const userRoutes = require('./user/userRoutes.js');
const tutorRoutes = require('./tutor/tutorRoutes.js');

router.use('/user', userRoutes);
router.use('/tutor', tutorRoutes);

module.exports = router;