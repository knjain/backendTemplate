const {categoryService} = require('../../services/event');
const catchAsync = require('../../utils/catchAsync');

const createCategory = catchAsync(async (req, res) => {
  const data = await categoryService.createCategory(req.body.name, req.file, req.body.categories);
  res.status(201).json({data});
});

const getCategories = catchAsync(async (req, res) => {
  const data = await categoryService.getCategories();
  res.json({data});
});

const updateCategory = catchAsync(async (req, res) => {
  const data = await categoryService.updateCategoryById(req.params.eventCategoryId, req.body.name, req.file);
  res.json({data});
});

const getOneCategory = catchAsync(async (req, res) => {
  const data = await categoryService.findCategoryById(req.params.eventCategoryId);
  res.json({data});
});

const deleteCategory = catchAsync(async (req, res) => {
  const data = await categoryService.deleteCategory(req.params.eventCategoryId);
  res.status(204).json({data});
});

module.exports = {
  createCategory,
  getCategories,
  getOneCategory,
  updateCategory,
  deleteCategory,
};
