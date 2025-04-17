import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfile, reset } from '../features/auth/authSlice';

function Profile() {
  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    password: '',
    confirmPassword: '',
  });
  
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user, navigate]);
  
  // Reset success/error messages when auth state changes
  useEffect(() => {
    if (isSuccess) {
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        dispatch(reset());
      }, 3000);
    }
  }, [isSuccess, dispatch]);
  
  const { username, email, bio, password, confirmPassword } = formData;
  
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  
  const onSubmit = (e) => {
    e.preventDefault();
    
    // Validate passwords if provided
    if (password) {
      if (password !== confirmPassword) {
        setPasswordError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setPasswordError('Password must be at least 6 characters');
        return;
      }
    }
    
    setPasswordError('');
    
    // Only include fields that have values
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (bio) updateData.bio = bio;
    if (password) updateData.password = password;
    
    dispatch(updateProfile(updateData));
  };
  
  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        
        {isError && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
            {message}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-100 text-green-700 p-4 rounded mb-6">
            {successMessage}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
              <img
                src={user?.avatar || '/default-avatar.jpg'}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.jpg";
                }}
              />
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold">{user?.username}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-gray-500 mt-2">
                Member since: {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="bio">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={bio}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                rows="4"
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                New Password (leave blank to keep current)
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>
            
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;