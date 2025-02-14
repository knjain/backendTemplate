const {catalogueService, salonService} = require('../../services/salon');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const {compareStrs} = require('../../utils/lib');
const {getPaginateConfig} = require('../../utils/queryPHandler');

const getServices = catchAsync(async (req, res) => {
  const {filters, options} = getPaginateConfig(req.query);
  filters.salon = req.params.salonId;
  options.populate = ['category::*', 'specialists::*'];
  const data = await (req.user.__t === 'NormalUser'
    ? catalogueService.getServicesOfSalon(req.params.salonId)
    : catalogueService.getServices(filters, options));
  res.status(200).send({data});
});

const getService = catchAsync(async (req, res) => {
  const data = await catalogueService.getServiceById(req.params.serviceId);
  res.status(200).send({data});
});

const createService = catchAsync(async (req, res) => {
  const salon = await salonService.getSalonByOwnerId(req.user._id);
  const data = await catalogueService.createService(
    {
      ...req.body,
      salon: salon._id,
    },
    req.file
  );
  res.status(201).send({data});
});

const updateService = catchAsync(async (req, res) => {
  const serviceDoc = await catalogueService.getServiceById(req.params.serviceId);
  if (!compareStrs(serviceDoc.salon.owner._id, userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Sorry, you are not allowed to perform this operation');
  }
  const data = await catalogueService.updateServiceById(req.params.serviceId, req.body, req.file);
  res.status(200).send({data});
});

const deleteService = catchAsync(async (req, res) => {
  const serviceDoc = await catalogueService.getServiceById(req.params.serviceId);
  if (!compareStrs(serviceDoc.salon.owner._id, userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Sorry, you are not allowed to perform this operation');
  }
  await catalogueService.deleteServiceById(req.params.serviceId);
  res.status(204).send();
});

module.exports = {
  getService,
  getServices,
  createService,
  updateService,
  deleteService,
};
