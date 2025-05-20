import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Captcha from '../components/Captcha';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [resetCaptcha, setResetCaptcha] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const handleCaptchaVerify = (verified) => {
    setIsCaptchaVerified(verified);
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isCaptchaVerified) {
      alert('Please complete the CAPTCHA verification');
      setResetCaptcha(prev => !prev); // Triggers CAPTCHA reset
      return;
    }

    const phone = formData.phone.trim();
    if (!isLogin && !/^\d{10,15}$/.test(phone)) {
      setError('Phone number must be 10-15 digits');
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? 'login' : 'signup';
      const response = await fetch(`https://pawtect-fyp-production.up.railway.app/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('userToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'admin') {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/dashboard');
      } else {
        localStorage.setItem('token', data.token);
        navigate('/profile');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg px-3">
        <Link to="/" className="navbar-brand">🏠 Home</Link>
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

          {/* Form */}
          <div className="col-md-6 bg-white p-3">
            <h5 className="text-center">{isLogin ? 'User Login' : 'Create Account'}</h5>

            {error && <div className="text-danger small text-center mb-2">{error}</div>}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <div className="mb-2">
                    <label>Full Name:</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Your name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="mb-2">
                    <label>Phone Number:</label>
                    <input
                      type="tel"
                      className="form-control form-control-sm"
                      placeholder="e.g. 03001234567"
                      required
                      pattern="[0-9]{10,15}"
                      title="10-15 digit phone number"
                      value={formData.phone}
                      onChange={(e) => {
                        const phone = e.target.value.replace(/\D/g, '');
                        setFormData({ ...formData, phone: phone.slice(0, 15) });
                      }}
                    />
                  </div>
                </>
              )}

              <div className="mb-2">
                <label>Email:</label>
                <input
                  type="email"
                  className="form-control form-control-sm"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="mb-2">
                <label>Password:</label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  placeholder="Password"
                  required
                  minLength="6"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <Captcha 
                  onVerify={handleCaptchaVerify} 
                  resetTrigger={resetCaptcha}
                />
              </div>

              <button type="submit" className="btn btn-sm btn-primary w-100 mt-2" disabled={loading}>
                {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
              </button>
            </form>

            <p className="mt-2 text-center" style={{ fontSize: '0.9rem' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button"
                className="btn btn-link btn-sm p-0"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
              >
                {isLogin ? 'Create Account' : 'Login Instead'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuthPage;