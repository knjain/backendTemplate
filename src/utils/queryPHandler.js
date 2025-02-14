const getPaginateConfig = (queryParams) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    ...filters
  } = queryParams;
  const options = { page, limit, sortBy, sortOrder };
  return { options, filters };
};

module.exports = {
  getPaginateConfig,
};
