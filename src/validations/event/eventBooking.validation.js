const Joi = require('joi');

const {objectId, dbOptionsSchema} = require('../custom.validation');

const createBooking = {
  params: {
    eventId: Joi.string()
      .custom(objectId)
      .required(),
  },
  body: Joi.object().keys({
    slot: Joi.string()
      .custom(objectId)
      .required(),
    ticket: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

const getBookings = {
  query: Joi.object().keys({
    ...dbOptionsSchema,
    event: Joi.string().custom(objectId),
  }),
};

const getOneBooking = {
  params: Joi.object().keys({
    eventBookingId: Joi.string()
      .custom(objectId)
      .required(),
    eventId: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

const updateAttendedStatus = {
  ...getOneBooking,
};

module.exports = {createBooking, getBookings, getOneBooking, updateAttendedStatus};
