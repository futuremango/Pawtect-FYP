import React, { useState } from 'react';
import axios from 'axios';
import Captcha from '../components/Captcha';

const AdoptionForm = ({ petId, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    experience: ''
  });
  const [resetCaptcha, setResetCaptcha] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const handleCaptchaVerify = (verified) => {
    setIsCaptchaVerified(verified);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isCaptchaVerified) {
      alert('Please complete the CAPTCHA verification');
      setResetCaptcha(prev => !prev); // Triggers CAPTCHA reset
      return;
    }
    try {
      const token = localStorage.getItem('userToken');
      
      const response = await axios.post(
        `http://localhost:5000/api/adoption/${petId}/request`,
        {}, // Send empty body since backend doesn't need form data
        {
          headers: {
            Authorization:` Bearer ${token}`
          }
        }
      );
  
      if (response.status === 201) {
        alert('Application submitted!');
        onClose();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit');
    }
  };

  return (
    <div className="container px-3">
      <form onSubmit={handleSubmit} className="needs-validation">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => {
              const onlyLetters = e.target.value.replace(/[^a-zA-Z\s]/g, '');
              setFormData({ ...formData, fullName: onlyLetters });
            }}
            required
          />
        </div>
  
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
  
        <div className="mb-3">
          <input
            type="tel"
            className="form-control"
            pattern="[0-9]{11}"
            maxLength="11"
            placeholder="Phone (11 digits)"
            value={formData.phone}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
              setFormData({ ...formData, phone: onlyNumbers });
            }}
            required
          />
        </div>
  
        <div className="mb-3">
          <textarea
            className="form-control"
            rows="2"
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />
        </div>
  
        <div className="mb-3">
          <textarea
            className="form-control"
            rows="2"
            placeholder="Previous Pet Experience"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            required
          />
          <Captcha 
            onVerify={handleCaptchaVerify} 
            resetTrigger={resetCaptcha}
          />
        </div>
  
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="button1" onClick={onClose}>Cancel</button>
          <button type="submit" className="button2">Submit Application</button>
        </div>
      </form>
    </div>  
  );
  
};

export default AdoptionForm;