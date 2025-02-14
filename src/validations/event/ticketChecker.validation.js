const Joi = require('joi');

const {dbOptionsSchema, objectId} = require('../custom.validation');

const getTicketCheckers = {
  query: Joi.object().keys({
    ...dbOptionsSchema,
    createdBy: Joi.string().custom(objectId),
  }),
};

const createTicketChecker = {
  body: Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
    name: Joi.string()
      .trim()
      .required(),
    phone: Joi.string()
      .trim()
      .required(),
  }),
};

module.exports = {getTicketCheckers, createTicketChecker};
