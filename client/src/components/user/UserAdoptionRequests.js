import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_URL;

const UserAdoptionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/adoption/user/requests`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setRequests(res.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load requests');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleCancelRequest = async (requestId) => {
    try {
      setCancelingId(requestId);
      const response = await axios.delete(
        `${API_BASE_URL}/api/adoption/requests/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data.message === 'Request canceled successfully') {
        setRequests(prev => prev.filter(req => req._id !== requestId));
      }
      
    } catch (err) {
      console.error('Cancellation Error:', err);
      alert(err.response?.data?.error || 'Failed to cancel. Please refresh and try again.');
    } finally {
      setCancelingId(null);
    }
  };

  if (loading) return <div>Loading requests...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="user-adoption-requests">
      <h3>Your Adoption Applications</h3>
      
      {requests.length === 0 ? (
        <div className="alert alert-info">
          You haven't submitted any adoption requests yet.
        </div>
      ) : (
        <div className="request-list">
          {requests.map(request => (
            <div key={request._id} className={`request-card status-${request.status}`}>
              <div className="pet-info">
                <img 
                  src={`${API_BASE_URL}${request.pet.image.startsWith('/') ? '' : '/'}${request.pet.image}`}
                  alt={request.pet.name}
                  className="pet-image"
                  onError={(e) => {
                    e.target.src = '/images/fallback-pet.jpg';
                    e.target.onerror = null;
                  }}
                />
<div className="pet-details">
  <h5>{request.pet.name}</h5>
  <div className="detail-grid">
    <div className="detail-item">
      <span className="detail-label">Breed:</span>
      <span>{request.pet.breed}</span>
    </div>
  
   
  </div>
</div>

               
              </div>
              
              <div className="status-info">
                <span className={`badge bg-${getStatusColor(request.status)}`}>
                  {request.status.toUpperCase()}
                </span>
                <p>Applied on: {new Date(request.createdAt).toLocaleDateString()}</p>
                {request.adminMessage && (
                  <div className="admin-message">
                    <strong>Admin Note:</strong> {request.adminMessage}
                  </div>
                )}
                <div className="actions mt-2">
                  {request.status === 'pending' && (
                    <button 
                      onClick={() => handleCancelRequest(request._id)}
                      disabled={cancelingId === request._id}
                      className="btn btn-danger btn-sm"
                    >
                      {cancelingId === request._id ? (
                        <>
                          <span className="spinner-border spinner-border-sm"></span>
                          Canceling...
                        </>
                      ) : (
                        'Cancel Request'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getStatusColor = (status) => {
  switch(status) {
    case 'approved': return 'success';
    case 'rejected': return 'danger';
    default: return 'warning';
  }
};


export default UserAdoptionRequests;