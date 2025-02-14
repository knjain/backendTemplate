/* eslint-disable no-async-promise-executor */
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const {compareStrs} = require('../utils/lib');
const {salonService} = require('../services/salon');

const salonOwnerGuard = () => async (req, res, next) => {
  const salonId = req.params.salonId;

  return new Promise(async (resolve, reject) => {
    const salon = await salonService.getSalonByOwnerId(req.user._id);
    if (!compareStrs(salon._id, salonId)) {
      reject(new ApiError(httpStatus.FORBIDDEN, 'Sorry, you are not allowed to access this'));
    }
    req.salon = salon;
    resolve();
  })
    .then(() => {
      next();
    })
    .catch(err => {
      next(err);
    });
};

module.exports = salonOwnerGuard;
