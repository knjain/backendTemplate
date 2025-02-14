const httpStatus = require('http-status');

const {fileUploadService} = require('../../microservices');
const {EventCategory} = require('../../models');
const ApiError = require('../../utils/ApiError');

async function findCategoryByName(name) {
  return EventCategory.findOne({name});
}

async function findCategoryById(id) {
  const doc = await EventCategory.findById(id);
  if (!doc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return doc;
}

async function createCategory(name, iconFile) {
  if (await findCategoryByName(name)) {
    throw new ApiError(httpStatus.CONFLICT, 'Category already exists');
  }
  const [icon] = await fileUploadService.s3Upload([iconFile], 'eventCategories');
  return EventCategory.create({name, icon});
}

async function updateCategoryById(id, name, iconFile) {
  const doc = await findCategoryById(id);
  const updates = {name};
  if (iconFile) {
    fileUploadService.s3Upsert({file: iconFile, existingFileKey: doc.icon.key}).catch(err => {
      console.log('🚀 ~ updateCategoryById ~ err:', err);
    });
  }
  return EventCategory.findByIdAndUpdate(id, updates, {new: true});
}

async function getCategories(filters) {
  return EventCategory.find(filters);
}

async function deleteCategory(id) {
  const deletedCategory = await EventCategory.findByIdAndDelete(id);
  if (!deletedCategory) throw new ApiError(httpStatus.NOT_FOUND);
  return deletedCategory;
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
  updateCategoryById,
  deleteCategory,
  verifyCategories,
  findCategoryById,
};
