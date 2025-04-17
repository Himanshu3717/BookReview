import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import { updateReview, deleteReview } from '../features/reviews/reviewSlice';
import { format } from 'date-fns';

function ReviewItem({ review }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(review.title);
  const [editText, setEditText] = useState(review.reviewText);
  const [editRating, setEditRating] = useState(review.rating);
  const [hover, setHover] = useState(0);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const isOwner = user && user._id === review.user._id;
  const isAdmin = user && user.isAdmin;

  const handleUpdate = () => {
    if (editTitle.trim() === '' || editText.trim() === '') {
      return;
    }
    
    dispatch(updateReview({
      reviewId: review._id,
      reviewData: {
        title: editTitle,
        reviewText: editText,
        rating: editRating,
      },
    }));
    
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      dispatch(deleteReview(review._id));
    }
  };

  const formatDate = (date) => {
    try {
      return format(new Date(date), 'MMMM d, yyyy');
    } catch (error) {
      return 'Invalid date',error;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <img
            src={review.user.avatar || '/default-avatar.jpg'}
            alt={review.user.username}
            className="w-10 h-10 rounded-full mr-3"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-avatar.jpg";
            }}
          />
          <div>
            <p className="font-semibold">{review.user.username}</p>
            <p className="text-sm text-gray-500">
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>
        
        {(isOwner || isAdmin) && !isEditing && (
          <div className="flex space-x-2">
            {isOwner && (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-blue-500 hover:text-blue-700"
              >
                <FaEdit />
              </button>
            )}
            <button 
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
          </div>
        )}
      </div>
      
      {!isEditing ? (
        <>
          <div className="flex mb-2">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className="mr-1"
                color={index < review.rating ? "#ffc107" : "#e4e5e9"}
              />
            ))}
          </div>
          <h4 className="text-lg font-semibold mb-2">{review.title}</h4>
          <p className="text-gray-700">{review.reviewText}</p>
        </>
      ) : (
        <div className="edit-form">
          <div className="mb-3">
            <label className="block text-gray-700 mb-1">Rating</label>
            <div className="flex">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                
                return (
                  <label key={index} className="cursor-pointer">
                    <input
                      type="radio"
                      name="editRating"
                      value={ratingValue}
                      onClick={() => setEditRating(ratingValue)}
                      className="hidden"
                    />
                    <FaStar
                      className="text-2xl mr-1"
                      color={ratingValue <= (hover || editRating) ? "#ffc107" : "#e4e5e9"}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                    />
                  </label>
                );
              })}
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-gray-700 mb-1">Review</label>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              rows="4"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditTitle(review.title);
                setEditText(review.reviewText);
                setEditRating(review.rating);
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-1 px-3 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewItem;