const Joi = require('joi');
const {
  dbOptionsSchema,
  convertFieldToRegEx,
  convertCSVToArray,
  fileSchema,
  validateObjectBySchema,
  objectId,
  convertCSVToObjectIdArray,
} = require('../custom.validation');

const {imageTypes, imgTypeToExtension, dayNames, salonSlotCategoryTypes} = require('../../constants');

const getSalonById = {
  params: Joi.object().keys({
    salonId: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

const getSalons = {
  query: Joi.object().keys({
    ...dbOptionsSchema,
    name: Joi.string()
      .trim()
      .custom(convertFieldToRegEx),
    email: Joi.string()
      .lowercase()
      .email(),
    categories: Joi.string()
      .custom(convertCSVToObjectIdArray)
      .custom((value, helpers) => ({
        $in: [...value],
      })),
    latitude: Joi.number(),
    longitude: Joi.number(),
    availableForBooking: Joi.boolean(),
    rating: Joi.number()
      .min(1)
      .max(4)
      .custom((value, helpers) => ({
        $gte: value,
      })),
    status: Joi.string().default('Active'),
  }),
};

const updateSalon = {
  params: Joi.object().keys({
    salonId: Joi.string()
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
    removedImages: Joi.custom(convertCSVToArray).custom(
      validateObjectBySchema(Joi.array().items(Joi.string().custom(objectId)))
    ),
    categories: Joi.string().custom(convertCSVToObjectIdArray),
    address: Joi.string().trim(),
    about: Joi.string(),
    availableForBooking: Joi.boolean(),
    latitude: Joi.number(),
    longitude: Joi.number(),
  }),
};

const updateSecurityAmtSettings = {
  params: Joi.object().keys({
    salonId: Joi.string()
      .custom(objectId)
      .required(),
  }),
  body: Joi.object().keys({
    amount: Joi.number(),
    message: Joi.string(),
    applicable: Joi.boolean().required(),
  }),
};

const addSpecialHr = {
  params: Joi.object().keys({
    salonId: Joi.string()
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
    salonId: Joi.string()
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
    salonId: Joi.string()
      .custom(objectId)
      .required(),
  }),
  body: Joi.object().keys({
    day: Joi.string()
      .valid(...dayNames)
      .required(),
    category: Joi.string()
      .valid(...salonSlotCategoryTypes)
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
    salonId: Joi.string()
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
    salonId: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

module.exports = {
  getSalonById,
  getSalons,
  updateSalon,
  updateSecurityAmtSettings,
  addSpecialHr,
  updateSpecialHr,
  updateSlot,
  removeSpecialHr,
  updateCategories,
  deleteRestaurant,
};
