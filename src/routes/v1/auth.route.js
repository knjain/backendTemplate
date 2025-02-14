const express = require('express');
const router = express.Router();

const validate = require('../../middlewares/validate');
const firebaseAuth = require('../../middlewares/firebaseAuth');
const authValidation = require('../../validations/auth.validation');

const {authController} = require('../../controllers');
const {fileUploadService} = require('../../microservices');

router.post('/token', validate(authValidation.generateToken), authController.generateToken);

router.post('/login', firebaseAuth('All'), authController.loginUser);

router.post('/register', validate(authValidation.register), firebaseAuth('User'), authController.registerUser);

router.post(
  '/admin-secretSignup',
  validate(authValidation.register),
  firebaseAuth('Admin'),
  authController.registerUser
);

router.post(
  '/em-signup',
  firebaseAuth('EventManager'),
  fileUploadService.multerUpload.fields([
    {name: 'companyThumbnail', maxCount: 1},
    {name: 'businessDoc', maxCount: 1},
  ]),
  validate(authValidation.eventManagerRegister),
  authController.registerEventManager
);

router.post('/tc-secretSignup', firebaseAuth('TicketChecker'), authController.registerUser);

router.post(
  '/restaurant-signup',
  firebaseAuth('RestaurantVendor'),
  fileUploadService.multerUpload.fields([
    {name: 'thumbnail', maxCount: 1},
    {name: 'businessDoc', maxCount: 1},
  ]),
  validate(authValidation.restaurantVendorRegister),
  authController.registerRestaurant
);

router.post(
  '/salon-signup',
  firebaseAuth('SalonOwner'),
  fileUploadService.multerUpload.fields([
    {name: 'thumbnail', maxCount: 1},
    {name: 'businessDoc', maxCount: 1},
  ]),
  validate(authValidation.salonOwnerRegister),
  authController.registerSalon
);

module.exports = router;
