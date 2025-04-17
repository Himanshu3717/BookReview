const Review = require('../models/Review');
const Book = require('../models/Book');

// @desc    Get all reviews for a book
// @route   GET /api/reviews?bookId=123
// @access  Public
const getReviews = async (req, res) => {
  try {
    const { bookId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const query = bookId ? { book: bookId } : {};

    const reviews = await Review.find(query)
      .populate('user', 'username avatar')
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments(query);

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500);
    throw new Error('Server Error');
  }
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { bookId, rating, reviewText, title } = req.body;

    // Check if user already reviewed this book
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      book: bookId,
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Book already reviewed');
    }

    // Create review
    const review = await Review.create({
      user: req.user._id,
      book: bookId,
      rating,
      reviewText,
      title,
    });

    // Update book average rating
    const book = await Book.findById(bookId);
    const allReviews = await Review.find({ book: bookId });
    
    const totalRating = allReviews.reduce((sum, item) => sum + item.rating, 0);
    book.averageRating = totalRating / allReviews.length;
    
    await book.save();

    // Return the new review with user information
    const populatedReview = await Review.findById(review._id).populate(
      'user',
      'username avatar'
    );

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
  try {
    const { rating, reviewText, title } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    // Check if user is review owner
    if (review.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this review');
    }

    // Update review
    review.rating = rating || review.rating;
    review.reviewText = reviewText || review.reviewText;
    review.title = title || review.title;

    const updatedReview = await review.save();

    // Update book average rating
    const book = await Book.findById(review.book);
    const allReviews = await Review.find({ book: review.book });
    
    const totalRating = allReviews.reduce((sum, item) => sum + item.rating, 0);
    book.averageRating = totalRating / allReviews.length;
    
    await book.save();

    res.json(updatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    // Check if user is review owner or admin
    if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error('Not authorized to delete this review');
    }

    await review.deleteOne();

    // Update book average rating
    const book = await Book.findById(review.book);
    const allReviews = await Review.find({ book: review.book });
    
    if (allReviews.length > 0) {
      const totalRating = allReviews.reduce((sum, item) => sum + item.rating, 0);
      book.averageRating = totalRating / allReviews.length;
    } else {
      book.averageRating = 0;
    }
    
    await book.save();

    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
};