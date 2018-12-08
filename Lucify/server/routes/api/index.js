const router = require('express').Router();

router.use('/review', require('./review'));

router.use('/yelp', require('./yelp'));

router.use('/places', require('./places'));

router.use('/dataset', require('./dataset'));


module.exports = router;
