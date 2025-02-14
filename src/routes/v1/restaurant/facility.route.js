const express = require('express');
const router = express.Router();

const {fileUploadService} = require('../../../microservices');
const validate = require('../../../middlewares/validate');
const firebaseAuth = require('../../../middlewares/firebaseAuth');
const {facilityController} = require('../../../controllers/restaurant');
const {facilityValidation} = require('../../../validations/restaurant');

router.post(
  '/',
  fileUploadService.multerUpload.single('icon'),
  // firebaseAuth('All'),
  validate(facilityValidation.createFacility),
  facilityController.createFacility
);

// router.delete('/', firebaseAuth('All'), facilityController.deleteFacility);

router.get('/', fileUploadService.multerUpload.single('icon'), firebaseAuth('All'), facilityController.getFacilities);

module.exports = router;
