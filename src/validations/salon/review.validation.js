const Joi = require('joi');
const {objectId, dbOptionsSchema, convertFieldToRegEx} = require('../custom.validation');

const baseParams = {
  salonId: Joi.string()
    .custom(objectId)
    .required(),
};

const baseParamsWithReviewId = {
  ...baseParams,
  reviewId: Joi.string()
    .custom(objectId)
    .required(),
};

const getReview = {
  params: Joi.object().keys(baseParamsWithReviewId),
};

const getReviews = {
  params: Joi.object().keys(baseParams),
  query: Joi.object().keys({
    ...dbOptionsSchema,
    name: Joi.string().custom(convertFieldToRegEx),
  }),
};

const createReview = {
  params: Joi.object().keys(baseParams),
  body: Joi.object().keys({
    rating: Joi.number().required(),
    reviewText: Joi.string().required(),
  }),
};

const reportReview = {
  params: Joi.object().keys(baseParamsWithReviewId),
  body: Joi.object().keys({
    reason: Joi.string().required(),
  }),
};

module.exports = {
  getReview,
  getReviews,
  createReview,
  reportReview,
};
