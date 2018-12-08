const router = require('express').Router();
const rp = require('request-promise');

router.post('/search', (req, res) => {

  if (!req.body.input) {
    return res.status(422).json({ errors: { review: "can't be blank" } });
  }

  const options = {
    method: 'POST',
    uri: 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json',
    qs: {
      key: process.env.GOOGLE_API_KEY,
      inputtype: 'textquery',
      input: req.body.input
    },
  };

  rp(options)
    .then((parsedBody) => {
      res.status(200).json(parsedBody);
    })
    .catch((err) => {
      res.status(500).json(err);
    });

  return res;
});

router.post('/details', (req, res) => {
  const options = {
    method: 'POST',
    uri: 'https://maps.googleapis.com/maps/api/place/details/json',
    qs: {
      key: process.env.GOOGLE_API_KEY,
      placeid: req.body.placeId,
      fields: 'review'
    },
  };
  rp(options)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});


module.exports = router;

