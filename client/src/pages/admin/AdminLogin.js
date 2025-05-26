import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  // You can move this to a .env file as REACT_APP_API_BASE for better management
  const API_BASE = 'https://pawtect-fyp-production.up.railway.app';

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const endpoint = isLogin ? 'login' : 'signup';
    const url = `${API_BASE}/api/admin/${endpoint}`;
    console.log(`[INFO] Sending ${endpoint.toUpperCase()} request to:`, url);

    const payload = isLogin
      ? {
          email: formData.email,
          password: formData.password
        }
      : formData;

    console.log('[INFO] Payload:', payload);

    // Login or Signup request
    const response = await axios.post(url, payload);
    console.log('[SUCCESS] Auth response:', response.data);

    const token = response.data.token;
    if (!token) {
      throw new Error('Token not received in response');
    }

    console.log('[INFO] Verifying token...');
    const verifyRes = await axios.get(`${API_BASE}/api/admin/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('[SUCCESS] Token verification response:', verifyRes.data);

    if (!verifyRes.data.verified) {
      throw new Error('Token validation failed');
    }

    // Save token locally
    localStorage.setItem('adminToken', token);
    console.log('[INFO] Token saved. Redirecting...');

    if (!isLogin) {
      setFormData({ name: '', email: '', password: '' });
      setIsLogin(true);
      alert('Admin account created successfully! Please login.');
    } else {
      navigate('/admin/dashboard');
    }
  } catch (err) {
    console.error('[ERROR] Login/signup failed:', err);
    const errorMessage =
      err.response?.data?.error || err.message || `Admin ${isLogin ? 'login' : 'signup'} failed`;
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
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
