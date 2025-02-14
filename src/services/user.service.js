const {User, Admin, EventManager, LocationSearchHistory} = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const {fileUploadService} = require('../microservices');
const {maxPromotionImages} = require('../constants');
const firebaseAdmin = require('firebase-admin');

async function getUserById(id) {
  return User.findById(id).then(doc => {
    if (!doc) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    return doc;
  });
}

async function getEventManagerById(id) {
  return EventManager.findById(id).then(doc => {
    if (!doc) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Event Manager not found');
    }
    return doc;
  });
}

async function updateUserById(id, newDetails, media = {}) {
  const user = await User.getUserById(id);

  const {bio, business, ...otherDetails} = newDetails;
  if (user.__t === 'EventManager') {
    if (bio) {
      user.bio = bio;
    }
    const promotion = ({images, video} = user.business.promotion);
    if (business?.removeImages) {
      const currentKeys = {};
      promotion.images.forEach(image => {
        currentKeys[image.key] = true;
      });
      const keysToBeRemoved = business.removeImages.filter(key => !!currentKeys[key]);
      const netCount =
        (user.business?.promotion?.images?.length || 0) + (media?.businessImages?.length || 0) - keysToBeRemoved.length;
      if (!(netCount > 0 && netCount <= maxPromotionImages)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'You can only upload up to 5 images.');
      }
      keysToBeRemoved.forEach(async key =>
        fileUploadService.s3Delete(key).catch(err => {
          console.log(err, 'failed to delete promotion video', key);
        })
      );
      promotion.images = [...promotion.images.filter(image => !keysToBeRemoved.includes(image.key))];
    }

    if ((media.businessVideo || business?.removeVideo) && promotion.video) {
      const {key} = promotion.video;
      fileUploadService.s3Delete(key).catch(err => {
        console.log(err, 'failed to delete promotion video', key);
      });
      promotion.video = null;
    }

    let newVideo = null;
    if (media.businessVideo) {
      newVideo = fileUploadService.s3Upload(media.businessVideo, `eventManger/${user._id}/business`);
    }
    let newImages = null;
    if (media.businessImages) {
      newImages = fileUploadService.s3Upload(media.businessImages, `eventManger/${user._id}/business`);
    }
    promotion.images = [...promotion.images, ...(newImages ? await Promise.resolve(newImages) : [])];
    if (newVideo) {
      newVideo = await Promise.resolve(newVideo);
      promotion.video = newVideo[0];
    }

    user.business.promotion = {...promotion};
    if (business) {
      delete business.removeImages;
      delete business.removeVideo;
    }

    if (business) {
      Object.keys(business).forEach(ele => {
        user.business[ele] = business[ele];
      });
    }
  }

  Object.keys(otherDetails).forEach(ele => {
    user[ele] = otherDetails[ele];
  });

  await user.save();
  return user;
}

async function markUserAsDeletedById(id) {
  return User.findByIdAndUpdate(id, {isDeleted: true}, {new: true}).then(async doc => {
    if (!doc) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    await firebaseAdmin.auth().deleteUser(doc.firebaseUid);
    return doc;
  });
}

async function deleteUserById(id) {
  return User.findByIdAndDelete(id).then(async doc => {
    if (!doc) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    await firebaseAdmin.auth().deleteUser(doc.firebaseUid);
    return doc;
  });
}

async function updateUserPreferencesById(id, newPrefs) {
  const user = await getUserById(id);
  Object.keys(newPrefs).map(key => {
    user.preferences[key] = newPrefs[key];
  });
  await user.save();
  return user;
}

async function getUsers(filters, options) {
  return User.paginate(filters, options);
}

async function updateAdmin(adminId, data) {
  return Admin.findByIdAndUpdate(adminId, data, {new: true, runValidators: true});
}

async function updateEventManagerById(
  id,
  data,
  {newBusinessDoc = null, newThumbnail = null, newImages = [], removedImages = []} = {}
) {
  const doc = await getEventManagerById(id);
  let currentImages = doc.companyImages;

  if (newImages.length > 0) {
    const newImagesCount = newImages.length;
    const removedImagesCount = removedImages.length;
    const existingImagesCount = currentImages.length;
    if (existingImagesCount - removedImagesCount + newImagesCount > 5) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You cannot add more than 5 images');
    }
  }
  if (newBusinessDoc) {
    fileUploadService.s3Upsert({
      file: newBusinessDoc,
      existingFileKey: doc.business.businessDoc.key,
    });
  }
  if (newThumbnail) {
    fileUploadService.s3Upsert({
      file: newThumbnail,
      existingFileKey: doc.companyThumbnail.key,
    });
  }

  if (removedImages.length > 0) {
    const objectKeys = [];
    currentImages = currentImages.filter(img => {
      const exists = removedImages.includes(img._id.toString());
      if (exists) {
        objectKeys.push(img.key);
      }
      return !exists;
    });
    Promise.allSettled(
      objectKeys.map(key =>
        fileUploadService.s3Delete(key).catch(err => {
          console.log(err, 'failed to delete images', objectKeys, err);
        })
      )
    );
  }

  await fileUploadService.s3Upload(newImages, `eventManagers/${id}`).then(newImages => {
    data.companyImages = [...currentImages, ...newImages];
  });

  return EventManager.findByIdAndUpdate(id, data, {new: true, runValidators: true});
}

async function saveUserSearch(userId, data) {
  return LocationSearchHistory.findOneAndUpdate(
    {userId},
    {
      $push: {
        searches: {
          $each: [data],
          $slice: -10,
        },
      },
    },
    {new: true, upsert: true}
  );
}

async function updateStandardUser(userId, updateData, profilePic) {
  if (profilePic) {
    const [uploadedProfilePic] = await fileUploadService.s3Upload([profilePic], 'profilePic');
    updateData.profilePic = uploadedProfilePic;
  }

  return User.findByIdAndUpdate(userId, updateData, {new: true});
}

async function getUserSearch(userId) {
  const doc = await LocationSearchHistory.findOne({userId});
  return doc?.searches || [];
}

async function getEventManagers(filters, options) {
  return EventManager.paginate(filters, options);
}

async function getEventManager(eventManagerId) {
  return EventManager.findById(eventManagerId);
}

module.exports = {
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  markUserAsDeletedById,
  updateUserPreferencesById,
  updateAdmin,
  updateEventManagerById,
  saveUserSearch,
  updateStandardUser,
  getUserSearch,
  getEventManagers,
  getEventManager,
};
