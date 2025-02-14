const express = require('express');
const router = express.Router();

const validate = require('../../middlewares/validate');
const firebaseAuth = require('../../middlewares/firebaseAuth');
const {fileUploadService} = require('../../microservices');
const {adminController} = require('../../controllers');
const {adminValidation} = require('../../validations');

router.post(
  '/createCategory',
  fileUploadService.multerUpload.single('icon'),
  validate(adminValidation.createCategory),
  // firebaseAuth("Admin"),
  adminController.createCategory
);

router.post(
  '/partners/:partnerId/request',
  validate(adminValidation.partnerRegistrationRequest),
  firebaseAuth('Admin'),
  adminController.handlePartnerStatus
);

router.post(
  '/partners/:partnerId/status',
  validate(adminValidation.partnerStatusRequest),
  firebaseAuth('Admin'),
  adminController.handlePartnerStatus
);

router.get('/users', validate(adminValidation.getUsers), firebaseAuth('Admin'), adminController.getUsers);

router.get('/users/:userId', validate(adminValidation.getUser), firebaseAuth('Admin'), adminController.getUser);

router.patch('/users/me', validate(adminValidation.updateMe), firebaseAuth('Admin'), adminController.updateMe);

module.exports = router;
