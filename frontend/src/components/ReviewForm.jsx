import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReview } from '../features/reviews/reviewSlice';
import { FaStar } from 'react-icons/fa';

function ReviewForm({ bookId }) {
  const [title, setTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [formError, setFormError] = useState('');

  const dispatch = useDispatch();
  const { isLoading, isError, message } = useSelector((state) => state.reviews);
  const { user } = useSelector((state) => state.auth);

  const onSubmit = (e) => {
    e.preventDefault();

    if (rating === 0) {
      setFormError('Please select a rating');
      return;
    }

    if (title.trim() === '') {
      setFormError('Please enter a review title');
      return;
    }

    if (reviewText.trim() === '') {
      setFormError('Please enter your review');
      return;
    }

    dispatch(createReview({
      bookId,
      title,
      reviewText,
      rating,
    }));

    // Reset form
    setTitle('');
    setReviewText('');
    setRating(0);
    setFormError('');
  };

  if (!user) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <p className="text-center">
          Please{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            log in
          </a>{' '}
          to leave a review.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6 rounded-lg mb-6">
      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
      
      {formError && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {formError}
        </div>
      )}
      
      {isError && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {message}
        </div>
      )}
      
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Your Rating</label>
          <div className="flex">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              
              return (
                <label key={index} className="cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value={ratingValue}
                    onClick={() => setRating(ratingValue)}
                    className="hidden"
                  />
                  <FaStar
                    className="text-2xl mr-1"
                    color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                  />
                </label>
              );
            })}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="title">
            Review Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            placeholder="Summarize your review"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="reviewText">
            Your Review
          </label>
          <textarea
            id="reviewText"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            rows="6"
            placeholder="Write your review here"
            required
          />
        </div>
        
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;