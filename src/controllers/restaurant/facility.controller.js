const {facilityService} = require('../../services/restaurant');
const catchAsync = require('../../utils/catchAsync');

const createFacility = catchAsync(async (req, res) => {
  const data = await facilityService.createFacility(req.body.name, req.file);
  res.status(201).send({data});
});

const getFacilities = catchAsync(async (req, res) => {
  const data = await facilityService.getFacilities();
  res.status(200).send({data});
});

const deleteAllFacilities = catchAsync(async (req, res) => {
  const data = await facilityService.deleteFacility();
  res.status(200).send({data});
});

module.exports = {
  createFacility,
  getFacilities,
  deleteAllFacilities,
};
