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
    return Business.findOne({ business_id });
  },
  findUserById: (user_id) => {
    return User.findOne({ user_id });
  },
  findReviewsByBusinessId: (business_id) => {
    return Review.find({ business_id }, { user_id: 1, date: 1, stars: 1, text: 1 });
  },
  findReviewsByUserId: (user_id) => {
    return Review.find({ user_id }, { business_id: 1, date: 1, stars: 1, text: 1 });
  },
  findReviewsByBusinessIdAndUserId: (business_id, user_id) => {
    return Review.find({ business_id, user_id }, { date: 1, stars: 1, text: 1 });
  },
};
