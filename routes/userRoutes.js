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

// Make sure `authMiddleware.protect` and `changePassword` are correctly referenced
router.put('/changePassword', authMiddleware.protect, authController.changePassword);


router.get('/logout', (req, res) => {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0), // Set to expire immediately
      secure: process.env.NODE_ENV === 'production', // Use secure in production
      sameSite: 'strict', // CSRF protection
    });
    
    res.status(200).json({ message: 'Logged out successfully' });
  });
  

router.get('/', authMiddleware.protect, authMiddleware.restrictTo('admin'), userController.getAllUsers);
router.post('/', authMiddleware.protect, authMiddleware.restrictTo('admin'), userController.createUser);
router.get('/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), userController.getUserById);
router.patch('/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), userController.updateUser);
router.delete('/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), userController.deleteUser);

module.exports = router;