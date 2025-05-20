import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserAppointments = () => {
  const [userAppointments, setUserAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);

  // Fetch appointments using authenticated user
  useEffect(() => {
    const fetchUserAppointments = async () => {
      try {
        setLoading(true);
        const appointmentsRes = await axios.get(
          `https://pawtect-fyp-production.up.railway.app/api/vet/appointments`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setUserAppointments(appointmentsRes.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError(err.response?.data?.error || 'Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAppointments();
  }, []); // Removed userEmail dependency

  // Cancel appointment with proper loading state
  const handleCancelAppointment = async (appointmentId) => {
    try {
      setCancelingId(appointmentId);
      await axios.delete(
        `${API_BASE_URL}/api/vet/appointments/${appointmentId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setUserAppointments(prev => 
        prev.filter(appt => appt._id !== appointmentId)
      );
      alert('Appointment cancelled successfully');
    } catch (err) {
      console.error('Cancellation error:', err);
      alert(err.response?.data?.error || 'Failed to cancel appointment');
    } finally {
      setCancelingId(null);
    }
  };

  if (loading) {
    return <div className="text-center my-4">Loading appointments...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mx-3">{error}</div>;
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title mb-4">Your Appointments</h2>
        
        {userAppointments.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">No upcoming appointments found</p>
            <button 
              className="btn btn-primary mt-2"
              onClick={() => window.location.href = '/vet'}
            >
              Book New Appointment
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="thead-light">
                <tr>
                  <th>Pet Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{appointment.petName}</td>
                    <td>
                      {new Date(appointment.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </td>
                    <td>{appointment.time}</td>
                    <td>{appointment.reason}</td>
                    <td>
                      <button 
                        onClick={() => handleCancelAppointment(appointment._id)}
                        className="btn btn-danger btn-sm"
                        disabled={cancelingId === appointment._id}
                      >
                        {cancelingId === appointment._id ? (
                          <>
                            <span 
                              className="spinner-border spinner-border-sm" 
                              role="status" 
                              aria-hidden="true"
                            ></span>
                            Cancelling...
                          </>
                        ) : (
                          'Cancel'
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAppointments;