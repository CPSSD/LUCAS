const mongoose = require('mongoose');
const { userSchema, reviewSchema, businessSchema } = require('./schema');

const User = mongoose.model('User', userSchema);
const Review = mongoose.model('Review', reviewSchema);
const Business = mongoose.model('Business', businessSchema);

module.exports = {
  connectDB: () => {
    mongoose.connect('mongodb://localhost/yelp_dataset', (err) => {
      if (err) {
        console.log(err);
      }
    });
  },
  findBusinessById: (business_id) => {
    Business.find({ business_id })
      .then((err, business) => {
        if (err) return console.log(err);
        return business;
      });
  },
  findUserById: (user_id) => {
    User.find({ user_id })
      .then((err, user) => {
        if (err) return console.log(err);
        return user;
      });
  },
  findReviewsByBusinessId: (business_id) => {
    Review.find({ business_id })
      .then((err, reviews) => {
        if (err) return console.log(err);
        return reviews;
      });
  },
  findReviewsByUserId: (user_id) => {
    Review.find({ user_id })
      .then((err, reviews) => {
        if (err) return console.log(err);
        return reviews;
      });
  },
  findReviewsByBusinessIdAndUserId: (business_id, user_id) => {
    Review.find({ business_id, user_id })
      .then((err, reviews) => {
        if (err) return console.log(err);
        return reviews;
      });
  },
};
