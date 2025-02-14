const express = require('express');
const router = express.Router();

const validate = require('../../middlewares/validate');
const firebaseAuth = require('../../middlewares/firebaseAuth');
const userValidation = require('../../validations/user.validation');

const {userController} = require('../../controllers');
const {fileUploadService} = require('../../microservices');

router.patch(
  '/event-manager',
  firebaseAuth('EventManager'),
  fileUploadService.multerUpload.fields([
    {name: 'companyThumbnail', maxCount: 1},
    {name: 'businessDoc', maxCount: 1},
    {name: 'companyImages', maxCount: 5},
  ]),
  validate(userValidation.updateEventManager),
  userController.updateEventManger
);

router.patch(
  '/me',
  firebaseAuth('StandardUser'),
  fileUploadService.multerUpload.single('profilePic'),
  validate(userValidation.updateStandardUser),
  userController.updateStandardUser
);

router.post('/me/searches', firebaseAuth('All'), validate(userValidation.userSearches), userController.saveUserSearch);

router.get('/me/searches', firebaseAuth('All'), userController.getUserSearch);

router.get(
  '/event-managers',
  firebaseAuth('All'),
  validate(userValidation.getEventManagers),
  userController.getEventManagers
);

router.get(
  '/:eventManagerId',
  firebaseAuth('Admin'),
  validate(userValidation.getEventManager),
  userController.getEventManagers
);

// router.patch('/delete', firebaseAuth('All'));

// // for deleting a user
// router.delete('/:userId', validate(userValidation.deleteUser), firebaseAuth('Admin'), userController.deleteUser);

// // for deleting a user
// router.patch(
//   '/delete/:userId',
//   validate(userValidation.deleteUser),
//   firebaseAuth('All'),
//   userController.softDeleteUser
// );

module.exports = router;
