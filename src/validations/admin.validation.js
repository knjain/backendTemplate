const Joi = require('joi');
const {categoryTypes, partnerRequestTypes, partnerRequest, partnerStatusTypes, status} = require('../constants');
const {dbOptionsSchema, convertFieldToRegEx} = require('./custom.validation');

const createCategory = {
  body: Joi.object().keys({
    name: Joi.string()
      .trim()
      .required(),
    type: Joi.string()
      .valid(...categoryTypes)
      .required(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    ...dbOptionsSchema,
    __t: Joi.string()
      .valid(...['Admin', 'EventManager'])
      .default({$exists: false}),
    name: Joi.string()
      .trim()
      .custom(convertFieldToRegEx),
    email: Joi.string()
      .trim()
      .custom(convertFieldToRegEx),
    phone: Joi.string()
      .trim()
      .custom(convertFieldToRegEx),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string()
      .trim()
      .required(),
  }),
};

const updateMe = {
  body: Joi.object().keys({
    name: Joi.string().trim(),
  }),
};

const partnerRegistrationRequest = {
  params: Joi.object().keys({
    partnerId: Joi.string()
      .trim()
      .required(),
  }),
  body: Joi.object().keys({
    status: Joi.string()
      .valid(...partnerRequestTypes)
      .required(),
    reason: Joi.when('status', {
      is: partnerRequest.REJECT,
      then: Joi.string()
        .trim()
        .required(),
      otherwise: Joi.string()
        .trim()
        .optional(),
    }),
  }),
};

const partnerStatusRequest = {
  params: Joi.object().keys({
    partnerId: Joi.string()
      .trim()
      .required(),
  }),
  body: Joi.object().keys({
    status: Joi.string()
      .valid(...partnerStatusTypes)
      .required(),
    reason: Joi.when('status', {
      is: status.SUSPENDED,
      then: Joi.string()
        .trim()
        .required(),
      otherwise: Joi.string()
        .trim()
        .optional(),
    }),
  }),
};
module.exports = {
  getUser,
  getUsers,
  createCategory,
  updateMe,
  partnerRegistrationRequest,
  partnerStatusRequest,
};
