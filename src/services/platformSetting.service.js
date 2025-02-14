const {PlatformSetting} = require('../models');

const seedPlatformSetting = initialSettings => PlatformSetting.create(initialSettings);

const getPlatformSettings = (filters = {}) => PlatformSetting.find(filters);

const updatePlatformSetting = (platformSettingName, data) =>
  PlatformSetting.findOneAndUpdate({name: platformSettingName}, data, {new: true, runValidators: true});

module.exports = {seedPlatformSetting, getPlatformSettings, updatePlatformSetting};
