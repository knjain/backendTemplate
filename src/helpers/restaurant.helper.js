const {restaurantService} = require('../services/restaurant');

async function getRestaurantById(id, user) {
  const data = await restaurantService.findRestaurantById(id);
  if (user._id.toString() !== data.vendor.toString() && user.__t !== 'Admin') {
    ['taxPayId', 'businessId', 'businessDoc'].map(key => {
      delete data[key];
    });
  }
  return data;
}

module.exports = {
  getRestaurantById,
};
