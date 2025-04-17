// Filter.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function Filter({ onGenreSelect }) {
  const [genres, setGenres] = useState([
    'Fiction', 
    'Non-fiction', 
    'Science Fiction', 
    'Fantasy', 
    'Mystery', 
    'Romance', 
    'Thriller', 
    'Horror', 
    'Biography', 
    'History'
  ]);
  const [selectedGenre, setSelectedGenre] = useState('');

  // This would normally fetch genres from the backend
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/books/genres');
        setGenres(res.data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  const handleGenreChange = (e) => {
    const genre = e.target.value;
    setSelectedGenre(genre);
    onGenreSelect(genre);
  };

  return (
    <div className="filter mb-4">
      <label className="block text-gray-700 mb-2 font-medium">
        Filter by Genre
      </label>
      <select
        value={selectedGenre}
        onChange={handleGenreChange}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Filter;