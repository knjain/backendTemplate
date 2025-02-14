const Joi = require('joi');
const {
  objectId,
  parseStringToObject,
  convertFieldToRegEx,
  validateObjectBySchema,
  fileSchema,
  parseTypedJSON,
  dbOptionsSchema,
} = require('./custom.validation');
const {imageTypes, imgTypeToExtension} = require('../constants');

const baseUpdateSchema = {
  name: Joi.string().trim(),
  phone: Joi.string().trim(),
  profilePic: Joi.string()
    .uri()
    .trim(),
  preferences: Joi.object({
    notificationEnabled: Joi.boolean(),
  }).unknown(false),
};

const updateUser = {
  body: Joi.object().keys({
    ...baseUpdateSchema,
  }),
};

const updateEventManager = {
  files: Joi.object().keys({
    companyThumbnail: Joi.array()
      .items(Joi.object().keys(fileSchema('Company thumbnail', imageTypes, Object.values(imgTypeToExtension))))
      .length(1)
      .custom(value => value[0]),
    businessDoc: Joi.array()
      .items(Joi.object().keys(fileSchema('Business Document', ['application/pdf'], ['pdf'])))
      .length(1)
      .custom(value => value[0]),
    companyImages: Joi.array()
      .items(Joi.object().keys(fileSchema('Company thumbnail', imageTypes, Object.values(imgTypeToExtension))))
      .max(5),
  }),
  body: Joi.object().keys({
    ...baseUpdateSchema,
    bio: Joi.string().trim(),
    businessId: Joi.string().trim(),
    taxPayId: Joi.string().trim(),
    categories: parseTypedJSON(
      Joi.array()
        .items(Joi.string().custom(objectId))
        .min(1)
    ),
    companyName: Joi.string().trim(),
    removedImages: Joi.array()
      .items(Joi.string())
      .default([]),
  }),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const userSearches = {
  body: Joi.object().keys({
    address: Joi.string()
      .trim()
      .required(),
    city: Joi.string()
      .trim()
      .required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }),
};

const updateStandardUser = {
  files: Joi.object().keys({
    profilePic: Joi.array()
      .items(Joi.object().keys(fileSchema('Profile Pic', imageTypes, Object.values(imgTypeToExtension))))
      .length(1)
      .custom(value => value[0]),
  }),
  body: Joi.object().keys({
    name: Joi.string().trim(),
    phone: Joi.string().trim(),
    dob: Joi.date(),
    notificationEnabled: Joi.boolean(),
  }),
};

const getEventManagers = {
  query: Joi.object().keys({
    ...dbOptionsSchema,
    name: Joi.string()
      .trim()
      .custom(convertFieldToRegEx),
    status: Joi.string().default('Active'),
  }),
};

const getEventManager = {
  params: Joi.object().keys({
    eventManagerId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  updateUser,
  deleteUser,
  updateEventManager,
  userSearches,
  updateStandardUser,
  getEventManagers,
  getEventManager,
};
