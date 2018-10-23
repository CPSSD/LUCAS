const router = require('express').Router();

router.use('/review', require('./review'));

module.exports = router;
