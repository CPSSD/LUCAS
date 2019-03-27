const mongoose = require('mongoose');
const { userSchema, reviewSchema, businessSchema } = require('./schema');


businessSchema.index({ categories: 'text' });

const User = mongoose.model('User', userSchema);
const Review = mongoose.model('Review', reviewSchema);
const Business = mongoose.model('Business', businessSchema);

module.exports = {
  connectDB: () => {
    mongoose.connect(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@134.209.31.100:27017/yelp_dataset?authSource=admin&w=1`, (err) => {
      if (err) {
        console.log(err);
      }
    });
  },
  findBusinessById: (business_id) => {
    return Business.findOne({ business_id });
  },
  getRandomBusiness: (categories) => {
    const query = { $text: { $search: categories }, review_count: { $gt: 10 } };
    return Business.countDocuments(query);
  },
  findBusinessByCategories: (categories, number) => {
    const query = { $text: { $search: categories }, review_count: { $gt: 10 } };
    const randomNum = Math.floor(Math.random() * number);
    return Business.findOne(query).limit(1).skip(randomNum);
  },
  findUserById: (user_id) => {
    return User.findOne({ user_id });
  },
  findReviewsByBusinessId: (business_id) => {
    return Review.find({ business_id }, { user_id: 1, date: 1, stars: 1, text: 1 });
  },
  findReviewsByUserId: (user_id) => {
    return Review.find({ user_id }, { business_id: 1, date: 1, stars: 1, text: 1 }).limit(5);
  },
  findReviewsByBusinessIdAndUserId: (business_id, user_id) => {
    return Review.find({ business_id, user_id }, { date: 1, stars: 1, text: 1 }).limit(5);
  },
};
