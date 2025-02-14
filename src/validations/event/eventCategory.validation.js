const Joi = require('joi');

const {imgTypeToExtension, imageTypes} = require('../../constants');
const {fileSchema, objectId} = require('../custom.validation');

const createCategory = {
  file: Joi.object()
    .keys(fileSchema('icon', imageTypes, Object.values(imgTypeToExtension)))
    .required(),
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const updateCategory = {
  params: Joi.object().keys({
    eventCategoryId: Joi.string()
      .custom(objectId)
      .required(),
  }),
  file: Joi.object().keys(fileSchema('icon', imageTypes, Object.values(imgTypeToExtension))),
  body: Joi.object().keys({
    name: Joi.string(),
  }),
};

const getOneCategory = {
  params: Joi.object().keys({
    eventCategoryId: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

const deleteCategory = getOneCategory;

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getOneCategory,
};
