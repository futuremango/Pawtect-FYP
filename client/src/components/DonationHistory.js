import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DonationHistory = ({ userId, refreshTrigger }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/donations/my-donations', {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: {
            _cache: Date.now() // Cache buster
          }
        });
        
        // Verify response structure
        if (response.data?.success) {
          setDonations(response.data.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        // Enhanced error handling
        if (err.response?.status === 401) {
          setError('Session expired - Please login again');
        } else {
          setError(err.response?.data?.error || 'Failed to load donations');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [userId, refreshTrigger]); // Add refreshTrigger to dependencies

  if (loading) return <div>Loading donations...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Donation History</h2>
      
      {donations.length === 0 ? (
        <div className="text-gray-500">No donations found</div>
      ) : (
        <div className="space-y-4">
          {donations.map(donation => (
            <div key={donation._id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">
                  {donation.type === 'money' ? 
                    `$${donation.amount} ${donation.currency}` : 
                    `${donation.items.length} Items Donated`}
                </h3>
                <span className={`px-2 py-1 text-sm rounded ${
                  donation.status === 'approved' ? 'bg-green-100 text-green-800' :
                  donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {donation.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Donated on: {new Date(donation.createdAt).toLocaleDateString()}
              </p>
              {donation.message && (
                <p className="mt-2 text-gray-600">"{donation.message}"</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationHistory;