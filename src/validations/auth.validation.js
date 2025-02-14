const Joi = require('joi');

const {
  objectId,
  convertCSVToArray,
  validateObjectBySchema,
  fileSchema,
  parseTypedJSON,
} = require('./custom.validation');
const {imageTypes, imgTypeToExtension} = require('../constants');

const baseRegisterSchema = {
  name: Joi.string().trim(),
};

const restaurantVendorRegister = {
  files: Joi.object()
    .keys({
      thumbnail: Joi.array()
        .items(Joi.object().keys(fileSchema('thumbnail', imageTypes, Object.values(imgTypeToExtension))))
        .length(1)
        .custom(value => value[0])
        .required(),
      businessDoc: Joi.array()
        .items(Joi.object().keys(fileSchema('business document', ['application/pdf'], ['pdf'])))
        .length(1)
        .custom(value => value[0])
        .required(),
    })
    .required(),
  body: Joi.object().keys({
    about: Joi.string(),
    categories: Joi.custom(convertCSVToArray)
      .custom(
        validateObjectBySchema(
          Joi.array()
            .items(Joi.string().custom(objectId))
            .min(1)
        )
      )
      .required(),
    address: Joi.string()
      .trim()
      .required(),
    businessId: Joi.string()
      .trim()
      .required(),
    taxPayId: Joi.string()
      .trim()
      .required(),
    latitude: Joi.number()
      .default(0)
      .required(),
    longitude: Joi.number()
      .default(0)
      .required(),
  }),
};

const salonOwnerRegister = {
  files: Joi.object()
    .keys({
      thumbnail: Joi.array()
        .items(Joi.object().keys(fileSchema('thumbnail', imageTypes, Object.values(imgTypeToExtension))))
        .length(1)
        .custom(value => value[0])
        .required(),
      businessDoc: Joi.array()
        .items(Joi.object().keys(fileSchema('business document', ['application/pdf'], ['pdf'])))
        .length(1)
        .custom(value => value[0])
        .required(),
    })
    .required(),
  body: Joi.object().keys({
    about: Joi.string(),
    categories: Joi.custom(convertCSVToArray)
      .custom(
        validateObjectBySchema(
          Joi.array()
            .items(Joi.string().custom(objectId))
            .min(1)
        )
      )
      .required(),
    address: Joi.string()
      .trim()
      .required(),
    businessId: Joi.string()
      .trim()
      .required(),
    taxPayId: Joi.string()
      .trim()
      .required(),
    latitude: Joi.number()
      .default(0)
      .required(),
    longitude: Joi.number()
      .default(0)
      .required(),
  }),
};

const eventManagerRegister = {
  files: Joi.object()
    .keys({
      companyThumbnail: Joi.array()
        .items(Joi.object().keys(fileSchema('Company thumbnail', imageTypes, Object.values(imgTypeToExtension))))
        .length(1)
        .custom(value => value[0])
        .required(),
      businessDoc: Joi.array()
        .items(Joi.object().keys(fileSchema('Business Document', ['application/pdf'], ['pdf'])))
        .length(1)
        .custom(value => value[0])
        .required(),
    })
    .required(),
  body: Joi.object().keys({
    ...baseRegisterSchema,
    businessId: Joi.string()
      .trim()
      .required(),
    taxPayId: Joi.string()
      .trim()
      .required(),
    categories: parseTypedJSON(
      Joi.array()
        .items(Joi.string().custom(objectId))
        .min(1)
        .required()
    ),
    companyName: Joi.string()
      .trim()
      .required(),
    bio: Joi.string().trim(),
  }),
};

const register = {
  body: Joi.object().keys({
    ...baseRegisterSchema,
  }),
};

const generateToken = {
  body: Joi.object().keys({
    uid: Joi.string().required(),
  }),
};

module.exports = {
  generateToken,
  register,
  eventManagerRegister,
  restaurantVendorRegister,
  salonOwnerRegister,
};
