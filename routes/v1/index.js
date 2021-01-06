const express = require('express');
const userRoutes = require('./user');
const authRoutes = require('./auth');
const directoryRoutes = require('./directory');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

// router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/directory', directoryRoutes)

module.exports = router;