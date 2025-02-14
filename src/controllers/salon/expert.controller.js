const {expertService, salonService, catalogueService} = require('../../services/salon');
const catchAsync = require('../../utils/catchAsync');
const {compareStrs} = require('../../utils/lib');
const {getPaginateConfig} = require('../../utils/queryPHandler');

const getExperts = catchAsync(async (req, res) => {
  const {filters, options} = getPaginateConfig(req.query);
  options.populate = ['categories::*'];
  const data = await expertService.getExperts(filters, options);
  res.status(200).send({data});
});

const getExpert = catchAsync(async (req, res) => {
  const [expertDetails, catalogue] = await Promise.all([
    expertService.getExpertById(req.params.expertId),
    catalogueService.getServicesOfExpert(req.params.expertId),
  ]);
  res.status(200).send({data: {...expertDetails.toObject(), catalogue}});
});

const createExpert = catchAsync(async (req, res) => {
  const salon = await salonService.getSalonByOwnerId(req.user._id);
  const data = await expertService.createExpert({...req.body, salon: salon._id}, req.file);
  res.status(201).send({data});
});

const updateExpert = catchAsync(async (req, res) => {
  const expertDoc = await expertService.getExpertById(req.params.expertId);
  if (!compareStrs(expertDoc.salon, req.user._id)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Sorry, you are not allowed to perform this operation');
  }
  const data = await expertService.updateExpertById(req.params.expertId, req.body, req.file);
  res.status(200).send({data});
});

const deleteExpert = catchAsync(async (req, res) => {
  const expertDoc = await expertService.getExpertById(req.params.expertId);
  if (!compareStrs(expertDoc.salon, req.user._id)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Sorry, you are not allowed to perform this operation');
  }
  await expertService.deleteExpertById(req.params.expertId);
  res.status(204).send();
});

module.exports = {
  getExpert,
  getExperts,
  createExpert,
  updateExpert,
  deleteExpert,
};
