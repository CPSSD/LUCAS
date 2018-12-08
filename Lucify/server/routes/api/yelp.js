const router = require('express').Router();
const yelp = require('yelp-fusion');
const fs = require('fs');

const client = yelp.client(process.env.YELP_API_KEY);

router.post('/search', (req, res) => {

  if (!req.body.term) {
    return res.status(422).json({ errors: { term: "can't be blank" } });
  }
  const options = {
    term: req.body.term,
    location: 'Dublin'
  };

  client.search(options).then((response) => {
    res.status(200).json(response.jsonBody.businesses);
  }).catch((e) => {
    res.status(500).json(e);
  });

  return res;
});

router.post('/reviews', (req, res) => {
  if (!req.body.alias) {
    return res.status(422).json({ errors: { alias: "can't be blank" } });
  }

  let reviews;
  fs.readFile('./server/mock/reviews.json', 'utf8', (err, data) => {
    if (err) throw err;
    reviews = JSON.parse(data);
    res.status(200).json(reviews);
  });

  return res;
});

router.post('/business', (req, res) => {

  if (!req.body.alias) {
    return res.status(422).json({ errors: { alias: "Business name can't be blank" } });
  }

  client.business(req.body.alias).then((response) => {
    res.status(200).json(response.jsonBody);
  }).catch((e) => {
    res.status(500).json(e);
  });

  return res;
});



module.exports = router;

