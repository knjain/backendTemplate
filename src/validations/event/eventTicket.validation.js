const Joi = require('joi');

const {objectId} = require('../custom.validation');

const createEventTicket = {
  params: Joi.object().keys({
    eventId: Joi.string()
      .custom(objectId)
      .required(),
  }),
  body: Joi.object().keys({
    name: Joi.string()
      .trim()
      .required(),
    price: Joi.object()
      .keys({
        value: Joi.number().required(),
        currency: Joi.string()
          .trim()
          .required(),
      })
      .required(),
    availableCount: Joi.number()
      .integer()
      .required(),
    isEnabled: Joi.boolean(),
  }),
};

const getTickets = {
  params: Joi.object().keys({
    eventId: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

const updateTicket = {
  params: Joi.object().keys({
    eventId: Joi.string()
      .custom(objectId)
      .required(),
    ticketId: Joi.string()
      .custom(objectId)
      .required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().trim(),
    price: Joi.object().keys({
      value: Joi.number().required(),
      currency: Joi.string()
        .trim()
        .required(),
    }),
    availableCount: Joi.number().integer(),
    isEnabled: Joi.boolean(),
  }),
};

const deleteTicket = {
  params: Joi.object().keys({
    eventId: Joi.string()
      .custom(objectId)
      .required(),
    ticketId: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

module.exports = {
  createEventTicket,
  getTickets,
  updateTicket,
  deleteTicket,
};
