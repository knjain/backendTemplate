const {dishService, restaurantService} = require('../../services/restaurant');
const {getPaginateConfig} = require('../../utils/queryPHandler');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status');

const getDish = catchAsync(async (req, res) => {
  const data = await dishService.findDishById(req.params.dishId);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Dish not found');
  }
  res.status(200).send({data});
});

const getDishes = catchAsync(async (req, res) => {
  const {filters, options} = getPaginateConfig(req.query || {});
  options.populate = ['restaurant::_id,name', 'category::*', 'subCategory::*'];
  const data = await dishService.getDishes(filters, options);
  res.status(200).send({data});
});

const createDish = catchAsync(async (req, res) => {
  const restaurant = await restaurantService.getRestaurantByVendorId(req.user._id);
  const data = await dishService.createDish({...req.body, restaurant: restaurant._id}, req.file);
  res.status(201).send({data});
});

const updateDish = catchAsync(async (req, res) => {
  const data = await dishService.updateDishById(req.params.dishId, req.body, req.file);
  res.status(200).send({data});
});

const deleteDish = catchAsync(async (req, res) => {
  await dishService.deleteDishById(req.params.dishId, req.body);
  res.status(204).send();
});

const addSubCategory = catchAsync(async (req, res) => {
  const data = await dishService.addSubCategory(req.body.name);
  res.status(201).send({data});
});

const getSubCategories = catchAsync(async (req, res) => {
  const data = await dishService.getSubCategories();
  res.status(200).send({data});
});

module.exports = {
  getDish,
  getDishes,
  createDish,
  updateDish,
  deleteDish,
  addSubCategory,
  getSubCategories,
};
