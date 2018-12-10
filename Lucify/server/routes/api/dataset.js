const router = require('express').Router();
const mongodb = require('../../db/mongo');

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
    mongodb.findBusinessById(business_id).exec()
      .then((business) => {
        res.status(200).json(business);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } else {
    mongodb.getRandomBusiness(categories).exec()
      .then((count) => {
        mongodb.findBusinessByCategories(categories, count).exec()
          .then((business) => {
            res.status(200).json(business);
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }

  return res;
});


router.post('/getReviews', (req, res) => {
  const { user_id, business_id } = req.body;
  if (!business_id && !user_id) {
    return res.status(422).json({ errors: { fields: "Both user and business id can't be blank" } });
  }

  if (user_id && business_id) {
    mongodb.findReviewsByBusinessIdAndUserId(business_id, user_id).exec()
      .then((reviews) => {
        res.status(200).json(reviews);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } else if (user_id) {
    mongodb.findReviewsByUserId(user_id).exec()
      .then((reviews) => {
        res.status(200).json(reviews);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } else {
    mongodb.findReviewsByBusinessId(business_id).exec()
      .then((reviews) => {
        res.status(200).json(reviews);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }

  return res;
});

module.exports = router;

