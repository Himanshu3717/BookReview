const Book = require('../models/Book');

// Get all books with pagination
const getBooks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const genre = req.query.genre;
  const search = req.query.search;

  const query = {};
  
  if (genre) {
    query.genre = genre;
  }
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { author: { $regex: search, $options: 'i' } },
    ];
  }

  try {
    const books = await Book.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
      
    const total = await Book.countDocuments(query);
    
    res.json({
      books,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500);
    throw new Error('Server Error');
  }
};

// Get single book by ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      res.status(404);
      throw new Error('Book not found');
    }
    
    res.json(book);
  } catch (error) {
    res.status(500);
    throw new Error('Server Error');
  }
};

// Add a new book (admin only)
const addBook = async (req, res) => {
  const { title, author, description, coverImage, genre, publicationDate } = req.body;

  try {
    const book = await Book.create({
      title,
      author,
      description,
      coverImage,
      genre,
      publicationDate,
    });
    
    res.status(201).json(book);
  } catch (error) {
    res.status(500);
    throw new Error('Server Error');
  }
};

module.exports = {
  getBooks,
  getBookById,
  addBook,
};