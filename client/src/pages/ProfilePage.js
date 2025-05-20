import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/ProfilePage.css';
import UserAppointments from '../components/user/UserAppointments';
import UserAdoptionRequests from '../components/user/UserAdoptionRequests';
import UserLostPosts from '../components/user/UserLostPosts';
const API_BASE_URL = process.env.REACT_APP_API_URL;

const ProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewAvatar, setPreviewAvatar] = useState('');
  const [lostPetPosts, setLostPetPosts] = useState([]);
  const [activeSection, setActiveSection] = useState('profile');
  
  // Initialize from localStorage
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [userData, setUserData] = useState({
    _id: storedUser._id || '',
    name: storedUser.name || '',
    bio: storedUser.bio || '',
    phone: storedUser.phone || '',
    location: storedUser.location || '',
    email: storedUser.email || '',
    avatar: storedUser.avatar || null
  });

  // Initialize avatar preview
  useEffect(() => {
    if (storedUser.avatar) {
      const avatarUrl = storedUser.avatar.startsWith('http') 
        ? storedUser.avatar 
        : `https://pawtect-fyp-production.up.railway.app${storedUser.avatar}`;
      setPreviewAvatar(avatarUrl);
    }
  }, [storedUser.avatar]);

  const fetchUserPosts = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/posts/user/${storedUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setLostPetPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setError('Failed to load your posts');
    }
  }, [storedUser._id]);

  // Redirect to login if no token and fetch posts
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/auth');
    } else {
      fetchUserPosts();
    }
  }, [navigate, fetchUserPosts]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData({ ...userData, avatar: file });
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await axios.delete(
        `/api/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setLostPetPosts(lostPetPosts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Delete failed:', error);
      setError('Failed to delete post');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('bio', userData.bio);
      formData.append('phone', userData.phone);
      formData.append('location', userData.location);
      
      if (userData.avatar instanceof File) {
        formData.append('avatar', userData.avatar);
      }

      const response = await axios.patch(
        `${API_BASE_URL}/api/profile`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      // Update localStorage with complete user data
      const updatedUser = {
        ...storedUser,
        ...response.data.user
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update state
      setUserData(updatedUser);
      
      // Update avatar preview if changed
      if (response.data.user.avatar) {
        const avatarUrl = `https://pawtect-fyp-production.up.railway.app${response.data.user.avatar}`;
        setPreviewAvatar(avatarUrl);
      }

      alert('Profile updated successfully!');

    } catch (error) {
      console.error('Update failed:', error);
      setError(error.response?.data?.error || 'Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Sub-components
  const AdoptionRequests = () => (
    <div className="section-content">
      <h1 className='text-center'>Adoption Requests</h1>
      <UserAdoptionRequests />
      <div className="text-center mt-3">
        <Link to="/adoptdash" className="btn btn-primary">
          Adopt Another Pet
        </Link>
      </div>
    </div>
  );

  const VetAppointments = () => (
    <div>
      <h1 className='text-center'>Vet Appointments</h1>
      <UserAppointments />
      <Link to="/vet" className="btn btn-primary mt-3">
        Get a Vet Appointment
      </Link>
    </div>
  );

  return (
    <div className="page-wrapper mt-5"
      style={{
        backgroundImage: 'url(/images/dashboard.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <Navbar />
      
      <div className="profile-container">
        {/* Left Navigation Bar */}
        <nav className="left-nav mt-5 pt-5">
          <ul className="left-nav-list pt-5">
            <li className="nav-item">
              <Link
                onClick={() => setActiveSection('profile')}
                className={`nav-button ${activeSection === 'profile' ? 'active' : ''}`}
              >
                📍 Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link
                onClick={() => setActiveSection('lostPets')}
                className={`nav-button ${activeSection === 'lostPets' ? 'active' : ''}`}
              >
                🐾 My Lost Pets
              </Link>
            </li>
            <li className="nav-item">
              <Link
                onClick={() => setActiveSection('adoption')}
                className={`nav-button ${activeSection === 'adoption' ? 'active' : ''}`}
              >
                ❤ Adoption Requests
              </Link>
            </li>
            <li className="nav-item">
              <Link
                onClick={() => setActiveSection('vet')}
                className={`nav-button ${activeSection === 'vet' ? 'active' : ''}`}
              >
                📅 Vet Appointments
              </Link>
            </li>
            <li>
              {error && <div className="error-message">{error}</div>}
            </li>
          </ul>
        </nav>

        {/* Main Content Section */}
        <div className="main-content pt-5">
          {activeSection === 'profile' && (
            <div className="profile-card compact">
              <form onSubmit={handleUpdate}>
                <div className="avatar-section">
                  <div className="avatar-upload">
                    <img
                      src={
                        previewAvatar || 
                        (storedUser.avatar 
                          ? `https://pawtect-fyp-production.up.railway.app${storedUser.avatar}` 
                          : 'https://pawtect-fyp-production.up.railway.app/images/default-avatar.jpg'
                        )
                      }
                      alt="Profile"
                      className="profile-avatar"
                    />
                    <label className="avatar-upload-label">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="avatar-input"
                      />
                      <span className="upload-text">Change Photo</span>
                    </label>
                  </div>
                </div>

                <div className="profile-info">
                  <div className="form-group">
                    <input
                      type="text" 
                      placeholder='Full Name'
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <textarea
                      value={userData.bio} 
                      placeholder='Bio'
                      onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                      maxLength="200"
                      rows="2"
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="tel"                       
                      pattern="[0-9]{11}" 
                      maxLength="11"
                      placeholder="Phone (11 digits)"
                      value={userData.phone}
                      onChange={(e) => {
                        const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                        setUserData({ ...userData, phone: onlyNumbers });
                      }}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="text" 
                      placeholder='Location'
                      value={userData.location}
                      onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit" 
                    className="save-button"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeSection === 'lostPets' && (
            <div className="section-content">
              <UserLostPosts 
                userId={storedUser._id}
                onDeletePost={handleDeletePost} 
              />
            </div>
          )}

          {activeSection === 'adoption' && <AdoptionRequests />}
          {activeSection === 'vet' && <VetAppointments />}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;