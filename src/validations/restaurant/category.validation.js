const Joi = require('joi');
const {imgTypeToExtension, imageTypes} = require('../../constants');
const {fileSchema, objectId} = require('../custom.validation');

const createCategory = {
  file: Joi.object().keys({
    icon: Joi.object()
      .keys(fileSchema('icon', imageTypes, Object.values(imgTypeToExtension)))
      .required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const updateCategory = {
  params: Joi.object().keys({
    id: Joi.string()
      .custom(objectId)
      .required(),
  }),
  file: Joi.object().keys({
    icon: Joi.object().keys(fileSchema('icon', imageTypes, Object.values(imgTypeToExtension))),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
  }),
};

module.exports = {
  createCategory,
  updateCategory,
};
