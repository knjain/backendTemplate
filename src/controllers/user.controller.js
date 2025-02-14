const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {userService} = require('../services');
const {getPaginateConfig} = require('../utils/queryPHandler');

const updateUser = catchAsync(async (req, res) => {
  const updatedUser = await userService.updateUserById(req.user._id, req.body, req.files || {});
  res.status(200).send({data: updatedUser, message: 'Your details are updated'});
});

const updateEventManger = catchAsync(async (req, res) => {
  const {companyThumbnail: newThumbnail, businessDoc: newBusinessDoc, companyImages: newImages} = req.files;
  const {removedImages, ...reqBody} = req.body;
  const data = await userService.updateEventManagerById(req.user._id, reqBody, {
    newThumbnail,
    newBusinessDoc,
    newImages,
    removedImages,
  });
  res.json({data});
});

const updateUserPreferences = catchAsync(async (req, res) => {
  const updatedUser = await userService.updateUserPreferencesById(req.user._id, req.body);
  res.status(200).send({data: updatedUser, message: 'Your preferences are saved'});
});

const softDeleteUser = catchAsync(async (req, res) => {
  if (req.user.__t !== 'Admin' && req.params.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Sorry, you are not authorized to do this');
  }
  await userService.markUserAsDeletedById(req.params.userId);
  res.status(201).send({
    message: 'User has been removed successfully.',
  });
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(201).send({
    message: 'User has been deleted permanently.',
  });
});

const saveUserSearch = catchAsync(async (req, res) => {
  const {latitude, longitude, ...reqBody} = req.body;
  reqBody.location = {
    type: 'Point',
    coordinates: [longitude, latitude],
  };
  await userService.saveUserSearch(req.user._id, reqBody);
  res.status(200).json({success: true, message: 'User search saved'});
});

const updateStandardUser = catchAsync(async (req, res) => {
  const {notificationEnabled, ...updateData} = req.body;
  if (notificationEnabled !== undefined) {
    updateData.preferences = {notificationEnabled};
  }
  const result = await userService.updateStandardUser(req.user._id, updateData, req.file);
  res.status(200).send({data: result, message: 'Your details are updated'});
});

const getUserSearch = catchAsync(async (req, res) => {
  const result = await userService.getUserSearch(req.user._id);
  res.status(200).send({data: result});
});

const getEventManagers = catchAsync(async (req, res) => {
  const {options, filters} = getPaginateConfig(req.query);

  const data = await userService.getEventManagers(filters, options);

  res.status(200).send({data});
});

const getEventManager = catchAsync(async (req, res) => {
  const data = await userService.getEventManager(req.params.eventManagerId);

  res.status(200).send({data});
});

module.exports = {
  deleteUser,
  softDeleteUser,
  updateUser,
  updateUserPreferences,
  updateEventManger,
  saveUserSearch,
  updateStandardUser,
  getUserSearch,
  getEventManagers,
  getEventManager,
};
