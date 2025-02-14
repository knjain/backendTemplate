const {Guest} = require('./guest.model.js');
const {Restaurant} = require('./restaurant.model.js');
const {Category} = require('./category.model.js');
const {Contact} = require('./contact.model.js');
const {Facility} = require('./facility.model.js');
const {Review} = require('./review.model.js');
const {Dish, DishSubCategory} = require('./dish.model.js');
const {Booking} = require('./booking.model.js');

module.exports = {
  Facility,
  Dish,
  Review,
  Contact,
  Guest,
  Contact,
  Category,
  Restaurant,
  Booking,
  DishSubCategory,
};
