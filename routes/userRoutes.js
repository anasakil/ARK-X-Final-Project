const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');



router.post('/register', [
  body('username', 'Username is required').not().isEmpty(),
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
 body('email').isEmail().withMessage(' email is valid'),
  body('password', 'Password must be 6 or more characters long').isLength({ min: 6 }),
], authController.register);

router.post('/login', [
  body('username', 'Username is required').not().isEmpty(),
  body('password', 'Password is required').not().isEmpty()
], authController.login);


router.post('/forgotpassword', authController.forgotPassword);

router.put('/changePassword', authMiddleware.protect, authController.changePassword);


router.get('/logout', authController.logout );
  

router.get('/', authMiddleware.protect, authMiddleware.restrictTo('admin'), userController.getAllUsers);
router.post('/', authMiddleware.protect, authMiddleware.restrictTo('admin'), userController.createUser);
router.get('/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), userController.getUserById);
router.patch('/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), userController.updateUser);
router.delete('/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), userController.deleteUser);

module.exports = router;