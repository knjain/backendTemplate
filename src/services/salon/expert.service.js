const httpStatus = require('http-status');
const {fileUploadService} = require('../../microservices');
const {Expert} = require('../../models/salon');
const ApiError = require('../../utils/ApiError');

async function createExpert(details, profileImage) {
  const [profilePic] = await fileUploadService.s3Upload([profileImage], 'expertProfilePics');
  return Expert.create({...details, profilePic});
}

async function getExperts(filters, options) {
  return Expert.paginate(filters, options);
}

async function getExpertById(id) {
  const expert = await Expert.findById(id);
  if (!expert) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Expert not found');
  }
  return expert;
}

async function updateExpertById(id, details, profileImage = null) {
  const expert = await getExpertById(id);
  if (profileImage) {
    const oldKey = expert.profilePic.key;
    const [profilePic] = await fileUploadService.s3Upload([profileImage], 'expertProfilePics');
    fileUploadService.s3Delete(oldKey).catch(err => {
      console.log('Failed to delete this media', oldKey, err);
    });
    details.profilePic = profilePic;
  }
  return Expert.findByIdAndUpdate(id, details, {new: true});
}

async function deleteExpertById(id) {
  return Expert.findByIdAndDelete(id);
}

module.exports = {
  createExpert,
  getExperts,
  getExpertById,
  updateExpertById,
  deleteExpertById,
};
