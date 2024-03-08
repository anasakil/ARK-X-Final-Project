const express = require('express');
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getAllCategories)
  .post(protect, restrictTo('admin'), createCategory);

router.route('/:id')
  .get(getCategoryById)
  .patch(protect, restrictTo('admin'), updateCategory)
  .delete(protect, restrictTo('admin'), deleteCategory);

module.exports = router;
