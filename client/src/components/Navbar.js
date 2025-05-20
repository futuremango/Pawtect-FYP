      
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get user data safely
  const getUserData = () => {
    try {
      return JSON.parse(localStorage.getItem('user')) || {};
    } catch {
      return {};
    }
  };

  const [user, setUser] = useState(getUserData());

  // Sync user data across tabs
  useEffect(() => {
    const handleStorageChange = () => setUser(getUserData());
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <div className="nav-brand">
          <Link to="/" className="nav-logo">
            Paw<span>tect</span>
          </Link>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-controls="navbarNav"
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a
                className="nav-link"
                href="/#rescue"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Rescue
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/#surrender"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Surrender
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/#volunteer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Volunteer
              </a>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/community"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Lost Pets
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/donate"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Donate
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/adoptdash"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Adopt
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/chatbot"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Chat bot
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/Vet"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Online Vet
              </Link>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#about"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </a>
            </li>
            {user?.email ? (
              <li className="nav-item profile-dropdown" ref={dropdownRef}>
                <button
                  className="nav-link profile-toggle"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <img
                    src={user.avatar
                      ? `https://pawtect-fyp-production.up.railway.app${user.avatar}`
                      : '/images/default-avatar.jpg'}
                    alt="Profile"
                    className="profile-pic"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/default-avatar.jpg';
                    }}
                  />
                  <span className="username">{user.name || 'User'}</span>
                </button>
                <div className={`dropdown-content ${showDropdown ? 'show' : ''}`}>
                  <Link
                    to="/profile"
                    onClick={() => {
                      setShowDropdown(false);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    View Profile
                  </Link>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </li>
            ) : (
              <li className="nav-item">
                <Link
                  className="nav-link login-btn"
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login/Signup
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;