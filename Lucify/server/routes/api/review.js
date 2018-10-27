const rp = require('request-promise');
const router = require('express').Router();

router.post('/', (req, res) => {
  if (!req.body.review) {
    return res.status(422).json({ errors: { review: "can't be blank" } });
  }

  const options = {
    method: 'POST',
    uri: 'http://localhost:3008/classify',
    body: {
      review: req.body.review,
    },
    json: true
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


module.exports = router;
