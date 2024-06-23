const router = require('express').Router();
const apiRoutes = require('./api');

// Mount API routes
router.use('/api', apiRoutes);

module.exports = router;