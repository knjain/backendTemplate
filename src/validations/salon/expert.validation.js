const Joi = require('joi');
const {
  objectId,
  fileSchema,
  convertFieldToRegEx,
  dbOptionsSchema,
  convertCSVToObjectIdArray,
} = require('../custom.validation');
const {imgTypeToExtension, imageTypes} = require('../../constants');

const getExpert = {
  params: Joi.object().keys({
    expertId: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

const getExperts = {
  query: Joi.object().keys({
    ...dbOptionsSchema,
    name: Joi.string()
      .trim()
      .custom(convertFieldToRegEx),
    email: Joi.string()
      .lowercase()
      .email(),
    categories: Joi.string(),
  }),
};

const createExpert = {
  file: Joi.object()
    .keys(fileSchema('profilePic', imageTypes, Object.values(imgTypeToExtension)))
    .required(),
  body: Joi.object().keys({
    name: Joi.string().required(),
    bio: Joi.string().required(),
    categories: Joi.string()
      .custom(convertCSVToObjectIdArray)
      .required(),
    exp: Joi.number().required(),
  }),
};

const updateExpert = {
  params: Joi.object().keys({
    expertId: Joi.string()
      .custom(objectId)
      .required(),
  }),
  file: Joi.object().keys(fileSchema('profilePic', imageTypes, Object.values(imgTypeToExtension))),
  body: Joi.object().keys({
    name: Joi.string(),
    bio: Joi.string(),
    categories: Joi.string().custom(convertCSVToObjectIdArray),
    exp: Joi.number(),
  }),
};

const deleteExpert = {
  params: Joi.object().keys({
    expertId: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

module.exports = {
  getExpert,
  getExperts,
  updateExpert,
  createExpert,
  deleteExpert,
};
