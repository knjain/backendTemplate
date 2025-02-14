const httpStatus = require('http-status');

const catchAsync = require('../utils/catchAsync');
const {initialPlatformSettings} = require('../constants');
const {platformSettingService} = require('../services');
const ApiError = require('../utils/ApiError');

const seedPlatformSettings = catchAsync(async (req, res) => {
  const platformSettings = await platformSettingService.seedPlatformSetting(initialPlatformSettings);
  res.status(201).json({data: platformSettings});
});

const getPlatformSettings = catchAsync(async (req, res) => {
  const platformSettings = await platformSettingService.getPlatformSettings();
  res.json({data: platformSettings});
});

const updatePlatformSetting = catchAsync(async (req, res) => {
  const {platformSettingName} = req.params;
  const platformSetting = await platformSettingService.updatePlatformSetting(platformSettingName, req.body);
  if (!platformSetting)
    throw new ApiError(httpStatus.NOT_FOUND, `Could not find a platform setting with name ${platformSettingName}`);
  res.json({data: platformSetting});
});

module.exports = {seedPlatformSettings, getPlatformSettings, updatePlatformSetting};
