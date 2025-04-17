import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar mb-4 flex-grow">
      <label className="block text-gray-700 mb-2 font-medium">
        Search Books
      </label>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title or author"
          className="w-full p-2 pl-10 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <button
          type="submit"
          className="absolute right-0 top-0 h-full bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600 focus:outline-none"
        >
          Search
        </button>
      </div>
    </form>
  );
}

export default SearchBar;