const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');


router.route('/')
  .get(productController.getAllProducts)
  .post(authMiddleware.protect, authMiddleware.restrictTo('admin'), productController.createProduct);

router.route('/:id')
  .get(productController.getProductById)
  .patch(authMiddleware.protect, authMiddleware.restrictTo('admin'), productController.updateProduct)
  .delete(authMiddleware.protect, authMiddleware.restrictTo('admin'), productController.deleteProduct);

module.exports = router;
