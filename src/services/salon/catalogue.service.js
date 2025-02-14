const httpStatus = require('http-status');
const {fileUploadService} = require('../../microservices');
const {Catalogue} = require('../../models/salon');
const ApiError = require('../../utils/ApiError');

const serviceGroupedByCategoryPipeline = [
  // Lookup to get the details of the category
  {
    $lookup: {
      from: 'saloncategories',
      localField: 'category',
      foreignField: '_id',
      as: 'categoryDetails',
    },
  },
  // Unwind the categoryDetails array
  {$unwind: '$categoryDetails'},
  // Group by category and push services into an array
  {
    $group: {
      _id: '$categoryDetails',
      services: {$push: {_id: '$_id', name: '$name', price: '$price', image: '$image', description: '$description'}},
    },
  },
  // Project to reshape the output
  {
    $project: {
      _id: 0,
      _id: '$_id._id',
      name: '$_id.name',
      icon: '$_id.icon',
      createdAt: '$_id.createdAt',
      updatedAt: '$_id.updatedAt',
      services: 1,
    },
  },
  // Group all documents into a single array
  {
    $group: {
      _id: null,
      categories: {$push: '$$ROOT'},
    },
  },
  // Project to reshape the output
  {
    $project: {
      _id: 0,
      categories: 1,
    },
  },
];
async function createService(details, serviceImage) {
  const [image] = await fileUploadService.s3Upload([serviceImage], 'expertProfilePics');
  return Catalogue.create({...details, image});
}

async function getServices(filters, options) {
  return Catalogue.paginate(filters, options);
}

async function getServicesOfExpert(expertId) {
  const services = await Catalogue.aggregate([
    // Match documents where the specialist is present
    {$match: {specialists: expertId}},
    ...serviceGroupedByCategoryPipeline,
  ]);
  return services.length > 0 ? services[0].categories : [];
}

async function getServicesOfSalon(salonId) {
  console.log('🚀 ~ getServicesOfSalon ~ salonId:', salonId);
  const services = await Catalogue.aggregate([
    // Match documents where the specialist is present
    {$match: {salon: salonId}},
    ...serviceGroupedByCategoryPipeline,
  ]);
  return services.length > 0 ? services[0].categories : [];
}

async function getServiceById(id) {
  const service = await Catalogue.findById(id);
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Catalogue not found');
  }
  return service;
}

async function updateServiceById(id, details, serviceImage = null) {
  const service = await getServiceById(id);
  if (serviceImage) {
    const oldKey = service.image.key;
    const [image] = await fileUploadService.s3Upload([serviceImage], 'salonServiceImages');
    fileUploadService.s3Delete(oldKey).catch(err => {
      console.log('Failed to delete this media', oldKey, err);
    });
    details.image = image;
  }
  return Catalogue.findByIdAndUpdate(id, details, {new: true});
}

async function deleteServiceById(id) {
  return Catalogue.findByIdAndDelete(id);
}

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateServiceById,
  deleteServiceById,
  getServicesOfExpert,
  getServicesOfSalon,
};
