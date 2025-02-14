const admin = require('firebase-admin');

const {categoryService, userService, eventService, partnerService} = require('../services');
const catchAsync = require('../utils/catchAsync');
const {getPaginateConfig} = require('../utils/queryPHandler');

const createCategory = catchAsync(async (req, res) => {
  const newCategory = await categoryService.createCategory(req.body, req.file);
  res.status(200).send({data: newCategory, message: 'Category Created Successfully'});
});

const getUsers = catchAsync(async (req, res) => {
  const {filters, options} = getPaginateConfig(req.query || {});
  const data = await userService.getUsers(filters, options);

  const hostedEvents = {};
  if (filters.__t === 'EventManager') {
    await Promise.all(
      data.results.map(async user =>
        eventService
          .getEventsCountCreatedBy(user._id)
          .then(value => (hostedEvents[user._id] = value))
          .catch(err => {
            console.log('Failed to get events count for user ' + user._id, err);
          })
      )
    );
    data.results = [
      ...data.results.map(user => {
        return {...user, hostedEvents: hostedEvents[user._id]};
      }),
    ];
  }
  res.status(200).send({data});
});

const getUser = catchAsync(async (req, res) => {
  let user = await userService.getUserById(req.params.userId);
  if (user.__t === 'EventManager') {
    const hostedEvents = await eventService.getEventsCountCreatedBy(user._id);
    user = {...user.toObject(), hostedEvents};
  }
  res.status(200).send({data: user});
});

const updateMe = catchAsync(async (req, res) => {
  const user = await userService.updateAdmin(req.user._id, req.body);
  admin.auth().updateUser(user.firebaseUid, {displayName: user.name});
  res.json({data: user});
});

const handlePartnerStatus = catchAsync(async (req, res) => {
  const {status, reason = ''} = req.body;
  const {partnerId} = req.params;
  if (status === 'Active') {
    await partnerService.activatePartnerById(partnerId);
  } else if (status === 'Suspended') {
    await partnerService.suspendParnterById(partnerId, reason);
  } else if (status === 'Reject') {
    await partnerService.rejectPartnerById(partnerId, reason);
  }
  res.status(200).send({message: `Partner status changed to ${status}`});
});

module.exports = {
  createCategory,
  getUsers,
  getUser,
  updateMe,
  handlePartnerStatus,
};
