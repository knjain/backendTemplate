const Joi = require('joi');
const {
  objectId,
  convertFieldToRegEx,
  dbOptionsSchema,
  convertCSVToArray,
  fileSchema,
  validateObjectBySchema,
} = require('../custom.validation');
const {default: mongoose} = require('mongoose');
const {imgTypeToExtension, imageTypes, dayNames, restaurantSlotCategoryTypes} = require('../../constants');

const getRestaurantById = {
  params: Joi.object().keys({
    restaurantId: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

const getRestaurants = {
  query: Joi.object().keys({
    ...dbOptionsSchema,
    name: Joi.string()
      .trim()
      .custom(convertFieldToRegEx),
    email: Joi.string()
      .lowercase()
      .email(),
    categories: Joi.string()
      .custom(convertCSVToArray)
      .custom((value, helpers) => {
        return {$in: value.map(ele => new mongoose.Types.ObjectId(ele))};
      }),
    latitude: Joi.number(),
    longitude: Joi.number(),
    facilities: Joi.string()
      .custom(convertCSVToArray)
      .custom((value, helpers) => {
        return {$in: value.map(ele => new mongoose.Types.ObjectId(ele))};
      }),
    availableForBooking: Joi.boolean(),
    rating: Joi.number()
      .min(1)
      .max(4)
      .custom((value, helpers) => {
        return {
          $gte: value,
        };
      }),
    status: Joi.string().default('Active'),
  }),
};

const updateRestaurant = {
  params: Joi.object().keys({
    restaurantId: Joi.string()
      .custom(objectId)
      .required(),
  }),
  files: Joi.object().keys({
    thumbnail: Joi.array()
      .length(1)
      .items(Joi.object().keys(fileSchema('thumbnail', imageTypes, Object.values(imgTypeToExtension))))
      .custom((value, _) => value[0])
      .not(null),
    images: Joi.array()
      .items(Joi.object().keys(fileSchema('images', imageTypes, Object.values(imgTypeToExtension))))
      .min(1)
      .max(5),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    removedImages: Joi.custom(convertCSVToArray).default([]),
    categories: Joi.custom(convertCSVToArray).custom(
      validateObjectBySchema(Joi.array().items(Joi.string().custom(objectId)))
    ),
    facilities: Joi.custom(convertCSVToArray).custom(
      validateObjectBySchema(Joi.array().items(Joi.string().custom(objectId)))
    ),
    address: Joi.string().trim(),
    about: Joi.string(),
    availableForBooking: Joi.boolean(),
    latitude: Joi.number().default(0),
    longitude: Joi.number().default(0),
  }),
};

const updateSecurityAmtSettings = {
  params: Joi.object().keys({
    restaurantId: Joi.string()
      .custom(objectId)
      .required(),
  }),
  body: Joi.object().keys({
    amount: Joi.number(),
    message: Joi.string(),
    applicable: Joi.boolean().required(),
  }),
};

const updateOpeningHrs = {
  params: Joi.object().keys({
    restaurantId: Joi.string()
      .custom(objectId)
      .required(),
  }),
  body: Joi.object().keys({
    day: Joi.string().valid(...dayNames),
    schedule: Joi.object().keys({
      openTime: Joi.string().default(null),
      closeTime: Joi.string().default(null),
      closed: Joi.boolean().default(true),
    }),
  }),
};

const addSpecialHr = {
  params: Joi.object().keys({
    restaurantId: Joi.string()
      .custom(objectId)
      .required(),
  }),
  body: Joi.object().keys({
    date: Joi.date()
      .iso()
      .required(),
    schedule: Joi.object()
      .keys({
        openTime: Joi.string(),
        closeTime: Joi.string(),
        closed: Joi.boolean(),
      })
      .required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
  }),
};

const updateSpecialHr = {
  params: Joi.object().keys({
    restaurantId: Joi.string()
      .custom(objectId)
      .required(),
    specialHrId: Joi.string()
      .custom(objectId)
      .required(),
  }),
  body: Joi.object().keys({
    date: Joi.date()
      .iso()
      .required(),
    schedule: Joi.object()
      .keys({
        openTime: Joi.string(),
        closeTime: Joi.string(),
        closed: Joi.boolean(),
      })
      .required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
  }),
};

const updateSlot = {
  params: Joi.object().keys({
    restaurantId: Joi.string()
      .custom(objectId)
      .required(),
  }),
  body: Joi.object().keys({
    day: Joi.string()
      .valid(...dayNames)
      .required(),
    category: Joi.string()
      .valid(...restaurantSlotCategoryTypes)
      .required(),
    schedule: Joi.object()
      .keys({
        openTime: Joi.string(),
        closeTime: Joi.string(),
        closed: Joi.boolean(),
        gap: Joi.number(),
      })
      .required(),
  }),
};

const removeSpecialHr = {
  params: Joi.object().keys({
    restaurantId: Joi.string()
      .custom(objectId)
      .required(),
    specialHrId: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

const updateCategories = {
  body: Joi.object().keys({
    add: Joi.array()
      .default('')
      .items(Joi.string().custom(objectId)),
    remove: Joi.array()
      .default('')
      .items(Joi.string().custom(objectId)),
  }),
};

const deleteRestaurant = {
  params: Joi.object().keys({
    id: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

module.exports = {
  getRestaurantById,
  getRestaurants,
  updateRestaurant,
  updateCategories,
  deleteRestaurant,
  addSpecialHr,
  updateSpecialHr,
  updateOpeningHrs,
  removeSpecialHr,
  updateSlot,
  updateSecurityAmtSettings,
};
