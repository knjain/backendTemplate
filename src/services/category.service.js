const httpStatus = require('http-status');

const {Category} = require('../models');
const ApiError = require('../utils/ApiError');
const {fileUploadService} = require('../microservices');
const {isTextURL} = require('../validations/custom.validation');

async function findCategoryByName(name) {
  const category = await Category.findOne({
    name: {$regex: new RegExp(`^${name}$`, 'i')},
  });
  return category;
}

async function findCategoryById(id) {
  return await Category.findById(id);
}

async function createCategory(category, iconFile) {
  if (await findCategoryByName(category.name)) {
    throw new ApiError(httpStatus.CONFLICT, 'Category already exists');
  }

  const [icon] = await fileUploadService.s3Upload([iconFile], 'categoryIcons');
  if (!isTextURL(icon)) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error uploading category icon');
  }

  return Category.create({...category, icon}, {});
}

async function getCategories(filters, options) {
  const events = await Category.paginate(filters, options);
  return events;
}

module.exports = {
  getCategories,
  createCategory,
  findCategoryById,
  findCategoryByName,
};
