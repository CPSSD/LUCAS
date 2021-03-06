const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = {
  reviewSchema: new Schema({
    review_id: String,
    user_id: String,
    business_id: String,
    stars: Number,
    date: String,
    test: Boolean,
    useful: Number,
    funny: Number,
    cool: Number,
  }),
  businessSchema: new Schema({
    business_id: String,
    name: String,
    neighborhood: String,
    address: String,
    city: String,
    state: String,
    postal_code: String,
    latitude: Number,
    longtitude: Number,
    stars: Number,
    review_count: Number,
    is_open: Number,
    attributes: [{
      Alcohol: String,
      Ambience: String,
      BikeParking: String,
      BusinessAcceptsCreditCards: String,
      BusinessParking: String,
      Caters: String,
      DogsAllowed: String,
      DriveThru: String,
      GoodForKids: String,
      GoodForMeal: String,
      HasTV: String,
      NoiseLevel: String,
      OutdoorSeating: String,
      RestaurantsAttire: String,
      RestaurantsDelivery: String,
      RestaurantsGoodForGroups: String,
      RestaurantsPriceRange2: String,
      RestaurantsReservations: String,
      RestaurantsTableService: String,
      RestaurantsTakeOut: String,
      WheelchairAccessible: String,
      WiFi: String,
    }],
    categories: String,
    hours: [{
      Monday: String,
      Tuesday: String,
      Wednesday: String,
      Thursday: String,
      Friday: String,
      Saturday: String,
      Sunday: String,
    }]
  }),
  photoSchema: new Schema({
    photo_id: String,
    business_id: String,
    caption: String,
    label: String
  }),
  userSchema: new Schema({
    user_id: String,
    name: String,
    review_count: Number,
    yelping_since: String,
    friends: String,
    useful: Number,
    funny: Number,
    cool: Number,
    fans: Number,
    elite: String,
    average_stars: Number,
    compliment_hot: Number,
    compliment_more: Number,
    compliment_profile: Number,
    compliment_cute: Number,
    compliment_list: Number,
    compliment_note: Number,
    compliment_plain: Number,
    compliment_cool: Number,
    compliment_funny: Number,
    compliment_writer: Number,
    compliment_photos: Number,
  })
}
