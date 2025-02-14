const Joi = require('joi');

const {
  fileSchema,
  objectId,
  dbOptionsSchema,
  parseTypedJSON,
  convertFieldToRegEx,
  convertCSVToArray,
  validateObjectBySchema,
} = require('../custom.validation');
const {imageTypes, imgTypeToExtension} = require('../../constants');

const createEvent = {
  file: Joi.object()
    .keys(fileSchema('thumbnail', imageTypes, Object.values(imgTypeToExtension)))
    .required(),
  body: Joi.object().keys({
    address: Joi.string()
      .trim()
      .required(),
    city: Joi.string()
      .trim()
      .required(),
    title: Joi.string()
      .trim()
      .required(),
    description: Joi.string()
      .trim()
      .required(),
    tags: parseTypedJSON(
      Joi.array()
        .items(Joi.string().trim())
        .min(1)
        .required()
    ),
    categories: parseTypedJSON(
      Joi.array()
        .items(Joi.string().custom(objectId))
        .min(1)
    ),
    slots: parseTypedJSON(
      Joi.array()
        .items(
          Joi.object().keys({
            startDate: Joi.date()
              .iso()
              .required(),
            endDate: Joi.date()
              .iso()
              .required(),
          })
        )
        .required()
        .min(1)
    ),
    venueDetails: Joi.string()
      .trim()
      .required(),
    isOnline: Joi.boolean(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    isPublished: Joi.boolean(),
  }),
};

const updatePublishedStatus = {
  params: Joi.object().keys({
    eventId: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

const assignTicketChecker = {
  params: Joi.object().keys({
    eventId: Joi.string()
      .custom(objectId)
      .required(),
  }),
  body: Joi.object().keys({
    ticketChecker: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

const getEvents = {
  query: Joi.object().keys({
    ...dbOptionsSchema,
    longitude: Joi.number(),
    latitude: Joi.number(),
    radius: Joi.number().default(20),
    address: Joi.string()
      .trim()
      .custom(convertFieldToRegEx),
    isPublished: Joi.boolean(),
    isOnline: Joi.boolean(),
    search: Joi.string()
      .trim()
      .custom(convertFieldToRegEx),
    tags: Joi.custom(convertCSVToArray).custom(validateObjectBySchema(Joi.array().items(Joi.string()))),
    date: Joi.date().iso(),
    createdBy: Joi.string().custom(objectId),
  }),
};

const getTicketCheckerEvents = {
  query: Joi.object().keys({
    ...dbOptionsSchema,
    keyword: Joi.string().custom(convertFieldToRegEx),
  }),
};

const getOneEvent = {
  params: Joi.object().keys({
    eventId: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

const updateEventAvailability = {
  params: Joi.object().keys({
    eventId: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

module.exports = {
  createEvent,
  updatePublishedStatus,
  assignTicketChecker,
  getEvents,
  getTicketCheckerEvents,
  getOneEvent,
  updateEventAvailability,
};
