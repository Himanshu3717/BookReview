const express = require('express');
const router = express.Router();
const { 
  getBooks, 
  getBookById, 
  addBook 
} = require('../controllers/bookControllers');
const { protect, admin } = require('../middleware/authmiddleware');

router.route('/').get(getBooks).post(protect, admin, addBook);
router.route('/:id').get(getBookById);

module.exports = router;