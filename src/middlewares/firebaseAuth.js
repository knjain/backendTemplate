const admin = require('firebase-admin');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const serviceAccount = require('../../firebase-service-secret.json');
const {authService} = require('../services');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firebaseAuth = (allowUserType = 'User') => async (req, res, next) => {
  return new Promise(async (resolve, reject) => {
    const token = req.headers?.authorization?.split(' ')[1];
    // token not found
    //console.log(token);
    if (!token) {
      reject(new ApiError(httpStatus.BAD_REQUEST, 'Please Authenticate!'));
    }
    try {
      const payload = await admin.auth().verifyIdToken(token, true);
      console.log(payload);
      const user = await authService.getUserByFirebaseUId(payload.uid);
      if (!user) {
        if (req.path === '/register' || req.path.toLowerCase().includes('signup')) {
          req.newUser = payload;
          req.routeType = allowUserType;
        } else reject(new ApiError(httpStatus.NOT_FOUND, "User doesn't exist. Please create account"));
      } else {
        if (!allowUserType.split(',').includes(user.__t) && allowUserType !== 'All') {
          reject(new ApiError(httpStatus.FORBIDDEN, "Sorry, but you can't access this"));
        }
        if (user.isBlocked) {
          reject(new ApiError(httpStatus.FORBIDDEN, 'User is blocked'));
        }
        if (user.isDeleted) {
          reject(new ApiError(httpStatus.GONE, "User account doesn't exist anymore"));
        }
        req.user = user;
      }

      resolve();
    } catch (err) {
      if (err.code === 'auth/id-token-expired') {
        reject(new ApiError(httpStatus.UNAUTHORIZED, 'Session is expired.'));
      }
      console.log('FirebaseAuthError:', err);
      reject(new ApiError(httpStatus.UNAUTHORIZED, 'Failed to authenticate'));
    }
  })
    .then(() => next())
    .catch(err => next(err));
};

module.exports = firebaseAuth;
