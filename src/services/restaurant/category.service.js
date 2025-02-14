const {fileUploadService} = require('../../microservices');
const {Category} = require('../../models/restaurant');
const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status');

async function findCategoryById(id) {
  const doc = await Category.findById(id);
  if (!doc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return doc;
}

async function findCategoryByName(name) {
  return Category.findOne({name});
}
async function createCategory(name, iconFile) {
  if (await findCategoryByName(name)) {
    throw new ApiError(httpStatus.CONFLICT, 'Category already exists');
  }
  const [icon] = await fileUploadService.s3Upload([iconFile], 'restaurantCategories');
  return Category.create({name, icon});
}

async function updateCategoryById(id, name, iconFile) {
  const doc = await findCategoryById(id);
  const updates = {name};
  if (iconFile) {
    const [icon] = await fileUploadService.s3Upload([iconFile], 'restaurantCategories');
    updates.icon = icon;
    fileUploadService.s3Delete(doc.icon.key).catch(err => {
      console.log('🚀 ~ updateCategoryById ~ err:', err);
    });
  }
  return Category.findByIdAndUpdate(id, updates, {new: true});
}

async function getCategories() {
  return Category.find({});
}

async function verifyCategories(ids) {
  const selectedIds = ids.map(ele => ele.toString());
  const allCategories = await getCategories();
  const filteredCategories = allCategories.filter(ele => selectedIds.includes(ele._id.toString()));
  return filteredCategories.length === ids.length;
}

module.exports = {
  createCategory,
  getCategories,
  verifyCategories,
  updateCategoryById,
};
