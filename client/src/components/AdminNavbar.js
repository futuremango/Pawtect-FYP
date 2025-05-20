import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/adminNavbar.css';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logoutHandler = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const nav = document.querySelector('.vertical-admin-nav');
      const hamburger = document.querySelector('.hamburger-menu');
      
      if (isMenuOpen && !nav.contains(event.target) && !hamburger.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <>
      <div 
        className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`} 
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      <nav className={`vertical-admin-nav ${isMenuOpen ? 'active' : ''}`}>
        <div className="admin-branding">
          <h2>🐾 Pawtect Admin</h2>
        </div>
        <ul className="admin-nav-menu"> 
          <li>
            <Link 
              to="/admin/dashboard" 
              onClick={() => setIsMenuOpen(false)}
            >
              📊 Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/manage-adoptions"
              onClick={() => setIsMenuOpen(false)}
            >
              🐕 Manage Adoption
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/volunteers" 
              onClick={() => setIsMenuOpen(false)}
            >
              🌟 Volunteers CV
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/surrenders" 
              onClick={() => setIsMenuOpen(false)}
            >
              🏠 SurrenderList
            </Link>
          </li> 
          <li>
            <Link 
              to="/admin/rescues" 
              onClick={() => setIsMenuOpen(false)}
            >
              🚨 Rescue Requests
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/vetappointments" 
              onClick={() => setIsMenuOpen(false)}
            >
              🩺 Vet Appointments
            </Link>
          </li>
          {/* New Manage Donations Link Added Here */}
          <li>
            <Link 
              to="/admin/manage-donations" 
              onClick={() => setIsMenuOpen(false)}
            >
              💰 Manage Donations
            </Link>
          </li>
          <li>
            <button 
              onClick={logoutHandler}
              className="logout-button"
            >
              🔒 Logout
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default AdminNavbar;