const admin = require('firebase-admin');
const httpStatus = require('http-status');

const {authService} = require('../services');
const {categoryService: eventCategoryService} = require('../services/event');
const {categoryService: restaurantCategoryService, restaurantService} = require('../services/restaurant');
const {categoryService: salonCategoryService, salonService} = require('../services/salon');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {fileUploadService} = require('../microservices');
const config = require('../config/config');

const validateReq = req => {
  if (req.user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exist');
  }
  if (!req.newUser.email_verified) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email not verified');
  }
};
const createNewUserObject = newUser => ({
  name: newUser.name,
  email: newUser.email,
  firebaseUid: newUser.uid,
  profilePic: newUser.picture,
  isEmailVerified: newUser.isEmailVerified,
  firebaseSignInProvider: newUser.firebase.sign_in_provider,
  phone: newUser.phone_number,
});

const loginUser = catchAsync(async (req, res) => {
  console.log(req.user);
  if (req.user.__t === 'RestaurantVendor') {
    const {_id, availableForBooking} = await restaurantService.getRestaurantByVendorId(req.user._id);
    res.status(200).send({data: {restaurantId: _id, availableForBooking, ...req.user.toObject()}});
  } else if (req.user.__t === 'SalonOwner') {
    const {_id, availableForBooking} = await salonService.getSalonByOwnerId(req.user._id);
    res.status(200).send({data: {salonId: _id, availableForBooking, ...req.user.toObject()}});
  } else {
    res.status(200).send({data: req.user});
  }
});

const registerUser = catchAsync(async (req, res) => {
  validateReq(req);
  const userObj = {
    ...createNewUserObject(req.newUser),
    ...req.body,
  };
  let user = null;
  switch (req.routeType) {
    case 'User':
      user = await authService.createUser(userObj);
      break;
    case 'Admin':
      user = await authService.createAdmin(userObj);
      break;
    case 'TicketChecker':
      user = await authService.createTicketChecker(userObj);
      break;
    default:
      break;
  }

  res.status(201).send({data: user});
});

const registerEventManager = catchAsync(async (req, res) => {
  validateReq(req);
  if (!(await eventCategoryService.verifyCategories(req.body.categories))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "We couldn't find some of the categories. Reach out to support team");
  }

  const [[companyThumbnail], [businessDoc]] = await Promise.all([
    fileUploadService.s3Upload([req.files.companyThumbnail], 'eventManagerCompanyThumbnails'),
    fileUploadService.s3Upload([req.files.businessDoc], 'eventManagerBusinessDocs'),
  ]);

  const eventManager = await authService.createEventManager({
    ...createNewUserObject(req.newUser),
    phone: req.newUser.phone_number,
    ...req.body,
    companyThumbnail,
    businessDoc,
  });

  res.status(201).json({data: eventManager});
});

const registerRestaurant = catchAsync(async (req, res) => {
  validateReq(req);
  if (!(await restaurantCategoryService.verifyCategories(req.body.categories))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "We couldn't find some of the categories. Reach out to support team");
  }
  const [[thumbnail], [businessDoc]] = await Promise.all([
    fileUploadService.s3Upload([req.files.thumbnail], 'restaurantThumbnails'),
    fileUploadService.s3Upload([req.files.businessDoc], 'businessDocs'),
  ]);
  const {latitude, longitude, ...reqBody} = req.body;

  const restaturantDetails = {
    ...reqBody,
    thumbnail,
    businessDoc,
    name: req.newUser.name,
    email: req.newUser.email,
    phone: req.newUser.phone_number,
    location: {type: 'Point', coordinates: [longitude, latitude]},
  };

  await authService
    .createRestaurantVendor({
      ...createNewUserObject(req.newUser),
      phone: req.newUser.phone_number || '+918239092301',
    })
    .then(async res => {
      await restaurantService.createRestaurant({...restaturantDetails, vendor: res._id});
    });

  res.status(201).send({message: 'Restaurant registered successfully'});
});

const registerSalon = catchAsync(async (req, res) => {
  validateReq(req);
  if (!(await salonCategoryService.verifyCategories(req.body.categories))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "We couldn't find some of the categories. Reach out to support team");
  }
  const [[thumbnail], [businessDoc]] = await Promise.all([
    fileUploadService.s3Upload([req.files.thumbnail], 'salonThumbnails'),
    fileUploadService.s3Upload([req.files.businessDoc], 'businessDocs'),
  ]);
  const {latitude, longitude, ...reqBody} = req.body;

  const salonDetails = {
    ...reqBody,
    thumbnail,
    businessDoc,
    name: req.newUser.name,
    email: req.newUser.email,
    phone: req.newUser.phone_number,
    location: {type: 'Point', coordinates: [longitude, latitude]},
  };

  await authService
    .createSalonOwner({
      ...createNewUserObject(req.newUser),
      phone: req.newUser.phone_number || '+918239092311',
    })
    .then(async res => {
      await salonService.createSalon({
        ...salonDetails,
        owner: res._id,
        phone: req.newUser.phone_number || '+918239092311',
      });
    });
  res.status(201).send({message: 'Salon registered successfully'});
});

const generateToken = catchAsync(async (req, res) => {
  if (config.env !== 'development')
    throw new ApiError(httpStatus.NOT_FOUND, 'Could not find the route you are looking for');

  const token = await admin.auth().createCustomToken(req.body.uid);
  const response = await fetch(
    `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${config.firebase.apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        returnSecureToken: true,
      }),
    }
  );

  const {idToken} = await response.json();

  res.json({data: idToken});
});

module.exports = {
  loginUser,
  registerUser,
  registerSalon,
  registerRestaurant,
  generateToken,
  registerEventManager,
};
