import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const API_BASE_URL = process.env.REACT_APP_API_URL;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const endpoint = isLogin ? 'login' : 'signup';
      const url = `${API_BASE_URL}/api/admin/${endpoint}`;
      
      const payload = isLogin ? {
        email: formData.email,
        password: formData.password
      } : formData;

      const response = await axios.post(url, payload);

      const verifyRes = await axios.get('/api/admin/verify', {
        headers: { Authorization: `Bearer ${response.data.token}` }
      });

      if (!verifyRes.data.verified) {
        throw new Error('Token validation failed');
      }

      localStorage.setItem('adminToken', response.data.token);
      
      if (!isLogin) {
        setFormData({ name: '', email: '', password: '' });
        setIsLogin(true);
        alert('Admin account created successfully! Please login.');
      } else {
        navigate('/admin/dashboard');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                         `Admin ${isLogin ? 'login' : 'signup'} failed`;
      setError(errorMessage);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg px-3">
        <Link to="/" className="navbar-brand">
          🏠 Home
        </Link>
      </nav>
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="row overflow-hidden" style={{ maxWidth: '700px', width: '100%' }}>
        
        {/* Left image */}
        <div className="col-md-6 d-none d-md-block p-0">
          <img
            src="/images/AuthCat.PNG"
            alt="Auth Cat"
            className="img-fluid"
            style={{ height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Form section */}
        <div className="col-md-6 bg-white p-3">
          <h5 className="text-center">Admin Authentication</h5>
          <h6 className="text-center mb-3">{isLogin ? 'Admin Login' : 'Create Admin Account'}</h6>

          {error && <div className="text-danger small text-center mb-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-2">
                <label>Name:</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Admin name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            )}

            <div className="mb-2">
              <label>Email:</label>
              <input
                type="email"
                className="form-control form-control-sm"
                placeholder="Admin email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="mb-2">
              <label>Password:</label>
              <input
                type="password"
                className="form-control form-control-sm"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                minLength="6"
              />
            </div>

            <button type="submit" className="btn btn-sm btn-primary w-100 mt-2">
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          <p className="mt-2 text-center" style={{ fontSize: '0.9rem' }}>
            {isLogin ? "Don't have an admin account? " : "Already have an account? "}
            <button 
              type="button"
              className="btn btn-link btn-sm p-0"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
            >
              {isLogin ? 'Create Admin Account' : 'Login Instead'}
            </button>
          </p>
        </div>
      </div>
    </div>
    
    </div>
  );
};

export default AdminLogin;
