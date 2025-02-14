const {salonHelper} = require('../../helpers');
const {salonService} = require('../../services/salon');
const catchAsync = require('../../utils/catchAsync');
const {getPaginateConfig} = require('../../utils/queryPHandler');

const getSalon = catchAsync(async (req, res) => {
  const data = await salonHelper.getSalonById(req.params.salonId, req.user);
  res.status(200).send({data});
});

const getSalons = catchAsync(async (req, res) => {
  const {filters: queryFilters, options} = getPaginateConfig(req.query);
  const {latitude, longitude, ...filters} = queryFilters;
  if (req.user.__t !== 'Admin') {
    filters.status = 'Active';
  }
  const location = longitude && latitude ? {latitude, longitude, radius: 20} : null;
  const data = await salonService.getSalons(filters, options, location);
  res.status(200).send({data});
});

const updateSalon = catchAsync(async (req, res) => {
  const {salonId} = req.params;
  const {longitude, latitude, ...updates} = req.body;
  if (latitude && longitude) {
    updates.location = {type: 'Point', coordinates: [latitude, longitude]};
  }
  const data = await salonService.updateSalonById(salonId, updates, req.files);
  res.status(200).send({data});
});

const updateSecurityAmtSettings = catchAsync(async (req, res) => {
  const {salonId} = req.params;
  const data = await salonService.updateSecurityAmtSettingsById(salonId, req.body);
  res.status(200).send({data});
});

const addSpecialHr = catchAsync(async (req, res) => {
  const {salonId} = req.params;
  const data = await salonService.addSpecialHrById(salonId, req.body);
  res.status(200).send({data});
});

const updateSpecialHr = catchAsync(async (req, res) => {
  const {salonId, specialHrId} = req.params;
  const data = await salonService.updateSpecialHrById(salonId, specialHrId, req.body);
  res.status(200).send({data});
});

const removeSpecialHr = catchAsync(async (req, res) => {
  const {salonId, specialHrId} = req.params;
  const data = await salonService.removeSpecialHrById(salonId, specialHrId);
  res.status(200).send({data});
});

const updateOpeningHrs = catchAsync(async (req, res) => {
  const {salonId} = req.params;
  const {day, schedule} = req.body;
  const data = await salonService.updateOpeningHrsById(salonId, day, schedule);
  res.status(200).send({data});
});

const updateSlot = catchAsync(async (req, res) => {
  const {salonId} = req.params;
  const {day, category, schedule} = req.body;
  const data = await salonService.updateSlotById(salonId, day, category, schedule);
  res.status(200).send({data});
});

module.exports = {
  getSalon,
  getSalons,
  updateSalon,
  updateSecurityAmtSettings,
  addSpecialHr,
  updateSpecialHr,
  removeSpecialHr,
  updateOpeningHrs,
  updateSlot,
};
