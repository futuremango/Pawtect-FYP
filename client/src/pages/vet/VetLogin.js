import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function VetLogin() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login/signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
const API_BASE_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'signup';

    try {
      const response = await axios.post(`${API_BASE_URL}/api/vet/${endpoint}`, {
        email,
        password,
      });

      if (isLogin) {
        setMessage('Login successful!');
        console.log('Token:', response.data.token);
        navigate('/vet/records');
      } else {
        setMessage('Signup successful! You can now log in.');
        setIsLogin(true); // Switch to login after successful signup
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Something went wrong');
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
        {/* Left Side - Image */}
        <div className="col-md-6 d-none d-md-block p-0">
          <img
            src="/images/AuthCat.PNG"
            alt="Auth Cat"
            className="img-fluid h-100"
            style={{ height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Right Side - Form */}
        <div className="col-md-6 p-4">
          <h3 className="text-center mb-2">Vet Authentication</h3>
          <h2 className="text-center mb-2">{isLogin ? 'Vet Login' : 'Vet Signup'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label>Email:</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <label>Password:</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary w-100" type="submit">
              {isLogin ? 'Login' : 'Signup'}
            </button>
          </form>

          <p className="mt-2 text-center">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign up here' : 'Login here'}
            </button>
          </p>

          {message && (
            <p
              className="text-center mt-2"
              style={{ color: message.includes('successful') ? 'green' : 'red' }}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

