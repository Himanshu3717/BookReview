const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authmiddleware');

router.post('/', registerUser);
router.post('/login', loginUser);
router.route('/:id').get(getUserProfile).put(protect, updateUserProfile);

module.exports = router;