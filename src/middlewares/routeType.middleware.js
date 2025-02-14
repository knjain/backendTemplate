const setRouteType = type => (req, res, next) => {
  req.routeType = type;
  next();
};

module.exports = setRouteType;
