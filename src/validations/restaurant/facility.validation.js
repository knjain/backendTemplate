const Joi = require('joi');

const createFacility = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};
module.exports = {
  createFacility,
};
