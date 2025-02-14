const Joi = require('joi');
const {objectId, convertFieldToRegEx, dbOptionsSchema, fileSchema} = require('../custom.validation');
const {imgTypeToExtension} = require('../../constants');

const baseParams = {
  dishId: Joi.string().custom(objectId),
};

const getDishById = {
  params: Joi.object().keys(baseParams),
};

const addSubCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const getDishes = {
  query: Joi.object().keys({
    ...dbOptionsSchema,
    name: Joi.string().custom(convertFieldToRegEx),
    price: Joi.number(),
    isNonVeg: Joi.boolean(),
    availability: Joi.boolean(),
    category: Joi.string().custom(objectId),
    createdBy: Joi.string().custom(objectId),
    subCategory: Joi.string().custom(convertFieldToRegEx),
    restaurant: Joi.string().custom(objectId),
  }),
};

const createDish = {
  file: Joi.object()
    .keys(fileSchema('image', Object.keys(imgTypeToExtension)))
    .required(),
  body: Joi.object().keys({
    name: Joi.string().required(),
    category: Joi.string()
      .custom(objectId)
      .required(),
    subCategory: Joi.string()
      .custom(objectId)
      .required(),
    price: Joi.number().required(),
    availability: Joi.boolean().required(),
  }),
};

const updateDish = {
  params: Joi.object().keys(baseParams),
  file: Joi.object().keys(fileSchema('image', Object.keys(imgTypeToExtension))),
  body: Joi.object().keys({
    name: Joi.string(),
    category: Joi.string().custom(objectId),
    subCategory: Joi.string().custom(objectId),
    isNonVeg: Joi.boolean(),
    price: Joi.string(),
    availability: Joi.boolean(),
  }),
};

const deleteDish = {
  params: Joi.object().keys(baseParams),
};

module.exports = {
  getDishById,
  getDishes,
  createDish,
  updateDish,
  deleteDish,
  addSubCategory,
};
