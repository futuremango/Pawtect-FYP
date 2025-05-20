import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/ManageAdoption.css'
const ManageAdoption = () => {
  // State for pet addition form
  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    medicalHistory: { vaccinated: false, neutered: false, specialNeeds: '' },
    description: '',
    image: null
  });

  // State for adoption requests
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('add');
// Add new state variables at the top of the component
const [showEmailForm, setShowEmailForm] = useState(false);
const [currentRequest, setCurrentRequest] = useState(null);
const [emailContent, setEmailContent] = useState({
  subject: '',
  message: '',
  status: ''
});

 // Add this useEffect to auto-refresh requests every 5 seconds when on requests tab
 useEffect(() => {
  const fetchRequests = async () => {
    try {
      const res = await axios.get('/api/admin/requests', {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      setRequests(res.data);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    }
  };

  if (activeTab === 'requests') {
    fetchRequests();
    const interval = setInterval(fetchRequests, 3000);
    return () => clearInterval(interval);
  }
}, [activeTab]);
// Add state for image preview
const [imagePreview, setImagePreview] = useState(null);

// Update image change handler
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setFormData({...formData, image: file});
    setImagePreview(URL.createObjectURL(file));
  }
};

// Add preview in the form
<div className="file-input">
  <label>
    Upload Image:
    <input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      required
    />
  </label>
  {imagePreview && (
    <img 
      src={imagePreview} 
      alt="Preview" 
      className="image-preview"
      style={{
        maxWidth: '200px',
        marginTop: '10px',
        borderRadius: '8px'
      }}
    />
  )}
  {formData.image && <span className="file-name">{formData.image.name}</span>}
</div>
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const data = new FormData();
    try {
      data.append('name', formData.name);
      data.append('species', formData.species);
      data.append('breed', formData.breed);
      data.append('age', formData.age);
      data.append('gender', formData.gender);
      data.append('description', formData.description);
      data.append('medicalHistory', JSON.stringify(formData.medicalHistory));
      data.append('image', formData.image);

      const response = await axios.post('/api/admin/adoption', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.status === 201) {
        alert('Pet added successfully!');
        setFormData({
          name: '',
          species: 'Dog',
          breed: '',
          age: '',
          gender: 'Male',
          medicalHistory: { vaccinated: false, neutered: false, specialNeeds: '' },
          description: '',
          image: null
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to add pet. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

   // Updated handleStatusChange function
   const handleStatusChange = async (requestId, newStatus) => {
    const selectedRequest = requests.find(req => req._id === requestId);
    setCurrentRequest(selectedRequest);
    setEmailContent({
      subject: `Adoption Request ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
      message: getDefaultMessage(newStatus, selectedRequest.pet?.name),
      status: newStatus
    });
    setShowEmailForm(true);
  };

  // Helper function for default email message
  const getDefaultMessage = (status, petName) => {
    if (status === 'approved') {
      return `Congratulations! Your adoption request for ${petName} has been approved.\n\n` +
             `Next steps:\n` +
             `1. Visit our shelter within 7 days to complete the adoption process\n` +
             `2. Bring a valid ID and proof of address\n` +
             `3. Pay the adoption fee (if applicable)\n\n` +
             `We're excited for you to welcome ${petName} into your home!`;
    } else {
      return `We regret to inform you that your adoption request for ${petName} has not been approved at this time.\n\n` +
             `Reason: [Please specify reason here]\n\n` +
             `You're welcome to apply for other pets in our shelter.`;
    }
  };

  // Email form handler
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      // First update the status
      await axios.patch(
        `/api/adoption/requests/${currentRequest._id}/status`,
        { status: emailContent.status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } }
      );
  
      // Then send the email WITH STATUS
      await axios.post(
        `/api/adoption/requests/${currentRequest._id}/notify`,
        {
          subject: emailContent.subject,
          message: emailContent.message,
          status: emailContent.status // Add status to payload
        },
        { headers: { 
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json' 
        } }
      );

      // Optimistic UI update
      setRequests(requests.map(req => 
        req._id === currentRequest._id ? { ...req, status: emailContent.status } : req
      ));

      setShowEmailForm(false);
      alert(`Request ${emailContent.status} and email sent successfully!`);
    } catch (err) {
      console.error('Full error:', err);
      alert(`Error: ${err.response?.data?.error || err.message || 'Unknown error'}`);
    }
  };


  return (
    <div className="manage-adoption"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/dashboard.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100%',
      }}
      
    >
      <div className="admin-tabs">
        <button 
          className={activeTab === 'add' ? 'active' : ''}
          onClick={() => setActiveTab('add')}
        >
          Add New Pet
        </button>
        <button
          className={activeTab === 'requests' ? 'active' : ''}
          onClick={() => setActiveTab('requests')}
        >
          Manage Requests (
            {requests.filter(req => req.status === 'pending').length} 
          )
        </button>
      </div>
  
      {activeTab === 'add' ? (
        <>
          <h1 className='text-center p-3 m-2'>Add New Pet for Adoption</h1>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <input 
                type="text" 
                placeholder="Pet Name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <select 
                value={formData.species}
                onChange={(e) => setFormData({...formData, species: e.target.value})}
              >
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Pet Breed"
                value={formData.breed}
                onChange={(e) => setFormData({...formData, breed: e.target.value})}
                required
              />

              <div className="form-section medical-checkboxes">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.medicalHistory.vaccinated}
                    onChange={(e) => setFormData({
                      ...formData,
                      medicalHistory: { ...formData.medicalHistory, vaccinated: e.target.checked }
                    })}
                  />
                  <span className="checkmark"></span>
                  Vaccinated
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.medicalHistory.neutered}
                    onChange={(e) => setFormData({
                      ...formData,
                      medicalHistory: { ...formData.medicalHistory, neutered: e.target.checked }
                    })}
                  />
                  <span className="checkmark"></span>
                  Neutered/Spayed
                </label>
              </div>
            </div>

            <div className="form-section">
              <input
                type="number"
                placeholder="Age (years)"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                min="0"
                required
              />
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unknown">Unknown</option>
              </select>
              <textarea
                placeholder="Detailed Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                minLength="20"
              />
              <div className="file-input">
                <label>
                  Upload Image:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                    required
                  />
                </label>
                {formData.image && <span className="file-name">{formData.image.name}</span>}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={isSubmitting ? 'submitting' : ''}
            >
              {isSubmitting ? 'Adding Pet...' : 'Add Pet'}
            </button>
          </form>
        </>
      ) : (
        <div className="manage-requests">
          <h2>Adoption Requests</h2>
          {requests.length === 0 ? (
            <div className="no-requests">
              <h3>No pending adoption requests 🐾</h3>
              <p>New requests will appear here automatically</p>
            </div>
          ) : (
            requests.map(request => (
              <div key={request._id} className="request-card">
                <div className="pet-info">
                  <h3>{request.pet?.name}</h3>
                  <img 
  src={`https://pawtect-fyp-production.up.railway.app${request.pet?.image?.startsWith('/') ? '' : '/'}${request.pet?.image}`}
  alt={request.pet?.name}
  className="pet-image"
  onError={(e) => {
    e.target.src = '/images/fallback.jpg';
    e.target.onerror = null;
  }}
/>
                </div>
                <div className="user-info">
                  <p>Applicant: {request.user?.name || 'Unknown'}</p>
                  <p>Email: {request.user?.email || 'No email'}</p>
                  <p className={`status-${request.status}`}>
                    Status: {request.status.toUpperCase()}
                  </p>
                </div>
                <div className="actions">
                  <button 
                    onClick={() => handleStatusChange(request._id, 'approved')}
                    disabled={request.status !== 'pending'}
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleStatusChange(request._id, 'rejected')}
                    disabled={request.status !== 'pending'}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
  
  {showEmailForm && (
  <div className="email-modal">
    <div className="email-modal-content">
      <h3>Send Response to {currentRequest.user?.name}</h3>
      <form onSubmit={handleEmailSubmit}>
        <div className="form-group">
          <label>Subject:</label>
          <input
            type="text"
            value={emailContent.subject}
            onChange={(e) => setEmailContent({...emailContent, subject: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Message:</label>
          <textarea
            value={emailContent.message}
            onChange={(e) => setEmailContent({...emailContent, message: e.target.value})}
            required
            minLength="20"
          />
        </div>
        <div className="modal-buttons">
          <button type="button" onClick={() => setShowEmailForm(false)}>
            Cancel
          </button>
          <button type="submit">
            Send & {emailContent.status === 'approved' ? 'Approve' : 'Reject'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
        </div>
      )}
       
    </div>
  );
};

export default ManageAdoption;