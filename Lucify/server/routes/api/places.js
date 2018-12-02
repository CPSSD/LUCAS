const router = require('express').Router();
const rp = require('request-promise');


const API_KEY = 'AIzaSyB7PR5Uv46LMRc44pUkQ7r2R5ZJI7BaXa8';


router.post('/search', (req, res) => {

  if (!req.body.input) {
    return res.status(422).json({ errors: { review: "can't be blank" } });
  }

  const options = {
    method: 'POST',
    uri: 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json',
    qs: {
      key: API_KEY,
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
      key: API_KEY,
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

