const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const {Salon} = require('../../models/salon');
const {fileUploadService} = require('../../microservices');

async function findSalonById(id) {
  const salon = await Salon.findById(id);
  if (!salon) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Salon not found');
  }
  return salon;
}

async function getSalons(filters, options, location = null) {
  return Salon.paginate(filters, options, location);
}

async function getSalonByOwnerId(ownerId) {
  const salon = await Salon.findOne({owner: ownerId});
  if (!salon) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Salon not found');
  }
  return salon;
}

async function addSpecialHrById(id, details) {
  return Salon.findByIdAndUpdate(
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
  const salon = await findSalonById(id);
  salon.specialHrs.pull(specialHrId);
  salon.specialHrs.push(details);
  await restaurant.save();
  return salon;
}

async function removeSpecialHrById(id, specialHrId) {
  return Salon.findByIdAndUpdate(
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
  return Salon.findByIdAndUpdate(
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
  return Salon.findByIdAndUpdate(
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
  return Salon.findByIdAndUpdate(
    id,
    {
      $set: {
        ...updates,
      },
    },
    {new: true}
  );
}

async function createSalon(details) {
  return Salon.create(details);
}

async function updateSalonById(id, newUpdates, files) {
  const salon = await findSalonById(id);
  const {thumbnail: newThumbnail, images = []} = files;
  const {removedImages = [], ...updates} = newUpdates;
  const promises = [];

  updates.images = salon.images;
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
          console.log(err, 'failed to delete images', objectKeys, err);
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
      fileUploadService.s3Upload(images, `salonImages/${id}`).then(newImages => {
        updates.images = [...updates.images, ...newImages];
      })
    );
  }

  if (newThumbnail) {
    promises.push(
      fileUploadService.s3Upload([newThumbnail], 'salonThumbnails').then(thumbnail => {
        updates.thumbnail = thumbnail[0];
      })
    );
  }
  await Promise.all(promises);
  return Salon.findByIdAndUpdate(id, updates, {new: true});
}

module.exports = {
  getSalons,
  addSpecialHrById,
  createSalon,
  findSalonById,
  updateOpeningHrsById,
  updateSalonById,
  getSalonByOwnerId,
  removeSpecialHrById,
  updateSpecialHrById,
  updateSlotById,
  updateSecurityAmtSettingsById,
};
