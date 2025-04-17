import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

function BookCard({ book }) {
  return (
    <Link to={`/books/${book._id}`} className="book-card block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <img 
        src={book.coverImage}
        alt={book.title}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/placeholder-book.jpg";
        }}
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-1 truncate">{book.title}</h3>
        <p className="text-gray-600 mb-2">by {book.author}</p>
        <div className="flex items-center mb-2">
          <FaStar className="text-yellow-500 mr-1" />
          <span>{book.averageRating.toFixed(1)}</span>
        </div>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
          {book.genre}
        </span>
      </div>
    </Link>
  );
}

export default BookCard;