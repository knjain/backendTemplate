const Joi = require('joi');

const {platformSettingNames} = require('../constants');

const updatePlatformSetting = {
  params: Joi.object().keys({
    platformSettingName: Joi.string().valid(...Object.values(platformSettingNames)),
  }),
  body: Joi.object().keys({
    value: Joi.number(),
    unit: Joi.string().valid('%', '$'),
  }),
};

module.exports = {updatePlatformSetting};
