const {Facility} = require('../../models/restaurant');
const {fileUploadService} = require('../../microservices');
const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status');

async function findFacilityByName(name) {
  return Facility.findOne({name});
}

async function getFacilities() {
  return Facility.find({});
}

async function createFacility(name, iconFile) {
  const facilityExists = await findFacilityByName(name);
  if (facilityExists) {
    throw new ApiError(httpStatus.CONFLICT, 'Facility already exists');
  }
  const [icon] = await fileUploadService.s3Upload([iconFile], 'facilityIcons');
  return Facility.create({name, icon});
}

module.exports = {
  createFacility,
  getFacilities,
};
