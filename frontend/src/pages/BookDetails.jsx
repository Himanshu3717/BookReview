import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { getBookById } from '../features/books/bookSlice';
import { getReviews, clearReviews } from '../features/reviews/reviewSlice';
import ReviewForm from '../components/ReviewForm';

function BookDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { book, isLoading: bookLoading } = useSelector((state) => state.books);
  const { 
    reviews, 
    isLoading: reviewsLoading, 
    totalPages, 
    currentPage 
  } = useSelector((state) => state.reviews);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getBookById(id));
    dispatch(getReviews({ bookId: id }));

    return () => {
      dispatch(clearReviews());
    };
  }, [dispatch, id]);

  const handlePageChange = (page) => {
    dispatch(getReviews({ bookId: id, page }));
  };

  if (bookLoading) {
    return <div className="text-center py-12">Loading book details...</div>;
  }

  if (!book) {
    return <div className="text-center py-12 text-red-500">Book not found!</div>;
  }

  // Format publication date
  const formattedDate = new Date(book.publicationDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Render star rating
  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= Math.round(rating) ? (
          <FaStar key={i} className="text-yellow-500" />
        ) : (
          <FaRegStar key={i} className="text-yellow-500" />
        )
      );
    }
    return stars;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/books" className="text-blue-500 hover:underline mb-6 inline-block">
        &larr; Back to Books
      </Link>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-auto rounded-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder-book.jpg";
              }}
            />
          </div>
          
          <div className="w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-gray-700 text-lg mb-4">by {book.author}</p>
            
            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {renderStarRating(book.averageRating)}
              </div>
              <span className="text-gray-600">
                ({book.averageRating.toFixed(1)})
              </span>
            </div>
            
            <div className="mb-4">
              <span className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold">
                {book.genre}
              </span>
              <span className="ml-4 text-gray-600">
                Published: {formattedDate}
              </span>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-6">
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{book.description}</p>
            </div>
            
            {user && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
              >
                {showReviewForm ? 'Cancel Review' : 'Write a Review'}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {showReviewForm && (
        <div className="mb-8">
          <ReviewForm bookId={id} setShowForm={setShowReviewForm} />
        </div>
      )}
      
      <div>
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        
        {reviewsLoading ? (
          <div className="text-center py-8">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No reviews yet. Be the first to review this book!</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{review.title}</h3>
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {renderStarRating(review.rating)}
                        </div>
                        <span className="text-gray-600">({review.rating})</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-700 font-medium">
                        {review.user.username}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.reviewText}</p>
                </div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                {[...Array(totalPages).keys()].map((x) => (
                  <button
                    key={x + 1}
                    className={`mx-1 px-3 py-1 border rounded ${
                      currentPage === x + 1 ? 'bg-blue-500 text-white' : ''
                    }`}
                    onClick={() => handlePageChange(x + 1)}
                  >
                    {x + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default BookDetails;