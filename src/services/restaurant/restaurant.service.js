const httpStatus = require('http-status');
const {Restaurant} = require('../../models/restaurant');
const ApiError = require('../../utils/ApiError');
const {fileUploadService} = require('../../microservices');

async function findRestaurantById(id) {
  const restaurant = await Restaurant.findById(id).populate('categories');
  if (!restaurant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Restaurant not found');
  }
  return restaurant;
}

async function getRestaurants(filters, options, location = null) {
  return Restaurant.paginate(filters, options, location);
}

async function getRestaurantByVendorId(vendorId) {
  const restaurant = await Restaurant.findOne({vendor: vendorId});
  if (!restaurant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Restaurant not found');
  }
  return restaurant;
}

async function addSpecialHrById(id, details) {
  return Restaurant.findByIdAndUpdate(
    id,
    {
      $push: {
        specialHrs: details,
      },
    },
    {new: true}
  );
}

async function updateSpecialHrById(id, specialHrId, details) {
  const restaurant = await findRestaurantById(id);
  restaurant.specialHrs.pull(specialHrId);
  restaurant.specialHrs.push(details);
  await restaurant.save();
  return restaurant;
}

async function removeSpecialHrById(id, specialHrId) {
  return Restaurant.findByIdAndUpdate(
    id,
    {
      $pull: {
        specialHrs: {_id: specialHrId},
      },
    },
    {new: true}
  );
}

async function updateOpeningHrsById(id, day, schedule) {
  return Restaurant.findByIdAndUpdate(
    id,
    {
      $set: {
        [`regularHrs.${day}`]: schedule,
      },
    },
    {new: true}
  );
}

async function updateSlotById(id, day, category, schedule) {
  return Restaurant.findByIdAndUpdate(
    id,
    {
      $set: {
        [`availableSlots.${day}.${category}`]: schedule,
      },
    },
    {new: true}
  );
}

async function updateSecurityAmtSettingsById(id, settings) {
  const updates = {};
  Object.entries(settings).forEach(([key, value]) => {
    updates[`security.${key}`] = value;
  });
  return Restaurant.findByIdAndUpdate(
    id,
    {
      $set: {
        ...updates,
      },
    },
    {new: true}
  );
}
async function createRestaurant(details) {
  return Restaurant.create(details);
}

async function updateRestaurantById(id, newUpdates, files) {
  const restaurant = await findRestaurantById(id);
  const {thumbnail: newThumbnail, images = []} = files;
  const {removedImages = [], ...updates} = newUpdates;
  const promises = [];

  updates.images = restaurant.images;
  if (removedImages.length > 0) {
    const objectKeys = [];
    updates.images = updates.images.filter(img => {
      const exists = removedImages.includes(img._id.toString());
      if (exists) {
        objectKeys.push(img.key);
      }
      return !exists;
    });
    promises.push(
      objectKeys.map(key =>
        fileUploadService.s3Delete(key).catch(err => {
          console.log(err, 'failed to delete promotion video', objectKeys);
        })
      )
    );
  }
  if (images.length > 0) {
    const newImagesCount = images.length;
    const removedImagesCount = removedImages.length;
    const existingImagesCount = updates.images.length;
    if (newImagesCount > 0 && existingImagesCount - removedImagesCount + newImagesCount > 5) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You cannot add more than 5 images');
    }
    promises.push(
      fileUploadService.s3Upload(images, `restaurantImages/${id}`).then(newImages => {
        updates.images = [...updates.images, ...newImages];
      })
    );
  }

  if (newThumbnail) {
    promises.push(
      fileUploadService.s3Upload([newThumbnail], 'restaurantThumbnails').then(thumbnail => {
        updates.thumbnail = thumbnail[0];
      })
    );
  }
  await Promise.all(promises);
  return Restaurant.findByIdAndUpdate(id, updates, {new: true});
}

module.exports = {
  getRestaurants,
  addSpecialHrById,
  createRestaurant,
  findRestaurantById,
  updateOpeningHrsById,
  updateRestaurantById,
  getRestaurantByVendorId,
  removeSpecialHrById,
  updateSpecialHrById,
  updateSlotById,
  updateSecurityAmtSettingsById,
};
