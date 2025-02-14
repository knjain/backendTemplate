const catchAsync = require('../../utils/catchAsync');
const {getPaginateConfig} = require('../../utils/queryPHandler');
const {restaurantHelper} = require('../../helpers');
const {restaurantService} = require('../../services/restaurant');
const ApiError = require('../../utils/ApiError');

const getRestaurant = catchAsync(async (req, res) => {
  const data = await restaurantHelper.getRestaurantById(req.params.restaurantId, req.user);
  res.status(200).send({data});
});

const getRestaurants = catchAsync(async (req, res) => {
  const {filters: queryFilters, options} = getPaginateConfig(req.query);
  const {longitude, latitude, ...filters} = queryFilters;
  if (req.user.__t !== 'Admin') {
    filters.status = 'Active';
  }
  console.log('🚀 ~ getRestaurants ~ filters:', filters);
  const location = longitude && latitude ? {latitude, longitude, radius: 20} : null;
  const data = await restaurantService.getRestaurants(filters, options, location);
  res.status(200).send({data});
});

const updateRestaurant = catchAsync(async (req, res) => {
  // vendor check remaining
  const {restaurantId} = req.params;
  const {longitude, latitude, ...updates} = req.body;
  if (latitude && longitude) {
    updates.location = {type: 'Point', coordinates: [longitude, latitude]};
  }
  const data = await restaurantService.updateRestaurantById(restaurantId, updates, req.files);
  res.status(200).send({data});
});

const updateSecurityAmtSettings = catchAsync(async (req, res) => {
  const {restaurantId} = req.params;
  const data = await restaurantService.updateSecurityAmtSettingsById(restaurantId, req.body);
  res.status(200).send({data});
});

const addSpecialHr = catchAsync(async (req, res) => {
  const {restaurantId} = req.params;
  const data = await restaurantService.addSpecialHrById(restaurantId, req.body);
  res.status(200).send({data});
});

const updateSpecialHr = catchAsync(async (req, res) => {
  const {restaurantId, specialHrId} = req.params;
  const data = await restaurantService.updateSpecialHrById(restaurantId, specialHrId, req.body);
  res.status(200).send({data});
});

const removeSpecialHr = catchAsync(async (req, res) => {
  const {restaurantId, specialHrId} = req.params;
  const data = await restaurantService.removeSpecialHrById(restaurantId, specialHrId);
  res.status(200).send({data});
});

const updateOpeningHrs = catchAsync(async (req, res) => {
  const {restaurantId} = req.params;
  const {day, schedule} = req.body;
  const data = await restaurantService.updateOpeningHrsById(restaurantId, day, schedule);
  res.status(200).send({data});
});

const updateSlot = catchAsync(async (req, res) => {
  const {day, category, schedule} = req.body;
  const data = await restaurantService.updateSlotById(req.params.restaurantId, day, category, schedule);
  res.status(200).send({data});
});

module.exports = {
  getRestaurant,
  getRestaurants,
  updateRestaurant,
  addSpecialHr,
  updateSpecialHr,
  updateOpeningHrs,
  removeSpecialHr,
  updateSlot,
  updateSecurityAmtSettings,
};
