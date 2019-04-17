const router = require('express').Router();
const mongodb = require('../../db/mongo');
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

router.post('/getUser', (req, res) => {

  if (!req.body.user_id) {
    return res.status(422).json({ errors: { user_id: "can't be blank" } });
  }

  mongodb.findUserById(req.body.user_id).exec()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json(err);
    });

  return res;
});

router.post('/getBusiness', (req, res) => {
  const { business_id, categories } = req.body;
  if (!business_id && !categories) {
    return res.status(422).json({ errors: { fields: "can't be blank" } });
  }

  if (business_id) {
    client.search({
      index: 'business',
      type: 'businesses',
      body: {
        query: {
          match: {
            business_id
          }
        }
      }
    }, (err, result) => {
      const { body } = result;
      if (err) res.status(500).send('Error');
      res.status(200).send(body.hits.hits[0]['_source']);
    });
  } else {
    client.search({
      index: 'business',
      type: 'businesses',
      body: {
        query: {
          match: {
            categories
          }
        }
      }
    }, (err, result) => {
      const { body } = result;
      if (err) res.status(500).send('Error');
      const results = body.hits.hits;
      res.status(200).send(results[Math.floor(Math.random() * results.length)]);
    });
  }

  return res;
});


router.post('/getReviews', (req, res) => {
  const { business_id } = req.body;
  if (!business_id) {
    return res.status(422).json({ errors: { fields: "business id can't be blank" } });
  }

  client.search({
    index: 'review',
    type: 'reviews',
    body: {
      _source: [ 'user_id', 'date', 'stars', 'text'],
      size: 500,
      query: {
        match: {
          business_id
        }
      }
    }
  }, (err, result) => {
    const { body } = result;
    if (err) res.status(500).send('Error');
    res.status(200).send(body.hits.hits);
  });

  return res;
});

router.post('/getUserData', (req, res) => {
  const { userIds } = req.body;
  if (!userIds) {
    return res.status(422).json({ errors: { fields: "User id can't be blank" } });
  }
  client.mget({
    index: 'stats',
    type: 'statistics',
    body: {
      ids: userIds
    }
  }, (err, result) => {
    const { body } = result;
    if (err) res.status(500).send('Error');
    res.status(200).send(body.docs);
  });


  return res;
});

module.exports = router;

