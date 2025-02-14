const express = require('express');
const router = express.Router();

const validate = require('../../../middlewares/validate');
const firebaseAuth = require('../../../middlewares/firebaseAuth');
const {salonController} = require('../../../controllers/salon');
const {salonValidation} = require('../../../validations/salon');

const categoryRoute = require('./category.route');
const catalogueRoute = require('./catalogue.route');
const expertRoute = require('./expert.route');
const bookingRoute = require('./booking.route');
const reviewRoute = require('./review.route');
const {fileUploadService} = require('../../../microservices');

router.use('/categories', categoryRoute);
router.use('/bookings', bookingRoute);
router.use('/:salonId/services', catalogueRoute);
router.use('/:salonId/experts', expertRoute);
router.use('/:salonId/reviews', reviewRoute);

router.get('/', firebaseAuth('All'), validate(salonValidation.getSalons), salonController.getSalons);
router.get('/:salonId', firebaseAuth('All'), validate(salonValidation.getSalonById), salonController.getSalon);

router.post(
  '/:salonId/specialHrs',
  firebaseAuth('SalonOwner'),
  validate(salonValidation.addSpecialHr),
  salonController.addSpecialHr
);

router.patch(
  '/:salonId',
  firebaseAuth('SalonOwner'),
  fileUploadService.multerUpload.fields([
    {name: 'thumbnail', maxCount: 1},
    {name: 'images', maxCount: 5},
  ]),
  validate(salonValidation.updateSalon),
  salonController.updateSalon
);

router.patch(
  '/:salonId/securityAmtSettings',
  firebaseAuth('SalonOwner'),
  validate(salonValidation.updateSecurityAmtSettings),
  salonController.updateSecurityAmtSettings
);

router.patch(
  '/:salonId/openingHrs',
  firebaseAuth('SalonOwner'),
  validate(salonValidation.updateOpeningHrs),
  salonController.updateOpeningHrs
);

router.patch(
  '/:salonId/slots',
  firebaseAuth('SalonOwner'),
  validate(salonValidation.updateSlot),
  salonController.updateSlot
);

router.patch(
  '/:salonId/specialHrs/:specialHrId',
  firebaseAuth('SalonOwner'),
  validate(salonValidation.updateSpecialHr),
  salonController.updateSpecialHr
);

router.delete(
  '/:salonId/specialHrs/:specialHrId',
  firebaseAuth('SalonOwner'),
  validate(salonValidation.removeSpecialHr),
  salonController.removeSpecialHr
);

module.exports = router;
