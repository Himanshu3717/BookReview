import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaUser, FaSignOutAlt, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { logout } from '../features/auth/authSlice';

function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const onSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/books?search=${searchTerm}`);
      setSearchTerm('');
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            BookReview
          </Link>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          
          {/* Search form - hidden on mobile, shown in menu */}
          <form 
            onSubmit={onSearch}
            className="hidden md:flex items-center flex-grow mx-6"
          >
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded text-gray-800 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-gray-600 hover:text-gray-800"
              >
                <FaSearch />
              </button>
            </div>
          </form>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/books" className="hover:text-blue-200">
              Browse Books
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center hover:text-blue-200">
                  <FaUser className="mr-1" />
                  {user.username}
                </Link>
                <button
                  onClick={onLogout}
                  className="flex items-center hover:text-blue-200"
                >
                  <FaSignOutAlt className="mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="hover:text-blue-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 hover:bg-blue-100 px-3 py-1 rounded"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mt-4 md:hidden">
            <form 
              onSubmit={onSearch}
              className="mb-4"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 rounded text-gray-800 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-gray-600 hover:text-gray-800"
                >
                  <FaSearch />
                </button>
              </div>
            </form>
            
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/books" 
                className="hover:text-blue-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Books
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className="flex items-center hover:text-blue-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUser className="mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center hover:text-blue-200"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hover:text-blue-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white text-blue-600 hover:bg-blue-100 px-3 py-1 rounded inline-block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;