import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getBooks } from '../features/books/bookSlice';
import BookCard from '../components/BookCard';

function Home() {
  const dispatch = useDispatch();
  const { books, isLoading, error } = useSelector((state) => state.books);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Get featured books (limiting to 4 for the home page)
    dispatch(getBooks({ limit: 4 }));
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Welcome to BookReviews</h1>
        <p className="text-gray-600 mb-6">
          Discover new books and share your thoughts with our community
        </p>
        
        {!user && (
          <div className="flex justify-center gap-4 mb-6">
            <Link 
              to="/login" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
            >
              Register
            </Link>
          </div>
        )}
        
        <Link 
          to="/books" 
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded"
        >
          Browse All Books
        </Link>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Featured Books</h2>
        
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">
            Error loading books. Please try again.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-500 text-2xl font-bold">1</span>
            </div>
            <h3 className="font-semibold mb-2">Browse Books</h3>
            <p className="text-gray-600">
              Explore our collection of books across various genres
            </p>
          </div>
          
          <div className="text-center p-4">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-green-500 text-2xl font-bold">2</span>
            </div>
            <h3 className="font-semibold mb-2">Read Reviews</h3>
            <p className="text-gray-600">
              See what others think about the books you're interested in
            </p>
          </div>
          
          <div className="text-center p-4">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-500 text-2xl font-bold">3</span>
            </div>
            <h3 className="font-semibold mb-2">Write Reviews</h3>
            <p className="text-gray-600">
              Share your own thoughts and ratings with the community
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;