const router = require('express').Router();

router.use('/review', require('./review'));

router.use('/yelp', require('./yelp'));


module.exports = router;
