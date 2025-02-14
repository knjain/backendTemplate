const Joi = require('joi');
const {
  objectId,
  dbOptionsSchema,
  convertFieldToRegEx,
  fileSchema,
  convertCSVToArray,
  convertCSVToObjectIdArray,
} = require('../custom.validation');
const {imageTypes, imgTypeToExtension, serviceDurationValues} = require('../../constants');

const getService = {
  params: Joi.object().keys({
    salonId: Joi.string()
      .custom(objectId)
      .required(),
    serviceId: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

const getServices = {
  params: Joi.object().keys({
    salonId: Joi.string()
      .custom(objectId)
      .required(),
  }),
  query: Joi.object().keys({
    ...dbOptionsSchema,
    name: Joi.string()
      .trim()
      .custom(convertFieldToRegEx),
    category: Joi.string().custom(objectId),
  }),
};

const createService = {
  params: Joi.object().keys({
    salonId: Joi.string()
      .custom(objectId)
      .required(),
  }),
  file: Joi.object()
    .keys(fileSchema('image', imageTypes, Object.values(imgTypeToExtension)))
    .required(),
  body: Joi.object().keys({
    name: Joi.string().required(),
    specialists: Joi.string()
      .custom(convertCSVToObjectIdArray)
      .required(),
    category: Joi.string()
      .custom(objectId)
      .required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
    availability: Joi.boolean().default(true),
    duration: Joi.string()
      .valid(...serviceDurationValues)
      .required(),
  }),
};

const updateService = {
  params: Joi.object().keys({
    salonId: Joi.string()
      .custom(objectId)
      .required(),
    serviceId: Joi.string()
      .custom(objectId)
      .required(),
  }),
  file: Joi.object().keys(fileSchema('image', imageTypes, Object.values(imgTypeToExtension))),
  body: Joi.object().keys({
    name: Joi.string(),
    specialists: Joi.string().custom(convertCSVToObjectIdArray),
    category: Joi.string().custom(objectId),
    price: Joi.number(),
    availability: Joi.boolean(),
    duration: Joi.string().valid(...serviceDurationValues),
  }),
};

const deleteService = {
  params: Joi.object().keys({
    serviceId: Joi.string()
      .custom(objectId)
      .required(),
    salonId: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

module.exports = {
  getService,
  getServices,
  createService,
  updateService,
  deleteService,
};
