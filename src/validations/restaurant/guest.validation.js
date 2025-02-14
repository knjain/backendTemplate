const Joi = require('joi');
const {objectId, dbOptionsSchema, convertFieldToRegEx} = require('../custom.validation');

const getGuestById = {
  params: Joi.object().keys({
    id: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

const getGuests = {
  query: Joi.object().keys({
    name: Joi.string()
      .trim()
      .custom(convertFieldToRegEx),
    email: Joi.string()
      .lowercase()
      .email(),
    phone: Joi.string(),
    lastBookedBy: Joi.string().custom(objectId),
  }),
};

const createGuest = {
  body: Joi.object().keys({
    name: Joi.string()
      .not('')
      .required(),
    email: Joi.string()
      .not('')
      .email(),
    phone: Joi.string(),
    lastBookedBy: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

const updateGuest = {
  body: Joi.object().keys({
    name: Joi.string().not(''),
    email: Joi.string().email(),
    phone: Joi.string(),
  }),
};

const deleteGuest = {
  params: Joi.object().keys({
    id: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

module.exports = {
  getGuestById,
  getGuests,
  createGuest,
  updateGuest,
  deleteGuest,
};
