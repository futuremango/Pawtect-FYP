import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { MdEmail, MdAttachMoney, MdInventory } from 'react-icons/md';
import '../../styles/ManageDonations.css';
 
Chart.register(...registerables);

const ManageDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalMoney, setTotalMoney] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get('/api/donations/all', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setDonations(response.data.data);
        
        const moneyDonations = response.data.data.filter(d => d.type === 'money');
        const total = moneyDonations.reduce((sum, d) => sum + d.amount, 0);
        setTotalMoney(total);
        setTotalItems(response.data.data.length - moneyDonations.length);
      } catch (err) {
        if(err.response?.status === 403) {
          setError('Admin privileges required');
        } else {
          setError(err.response?.data?.error || 'Failed to load donations');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchDonations();
  }, []);
  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      const adminMessage = prompt(`Enter message for ${status} status:`);
      
      if (!adminMessage) {
        alert('Please provide a status message');
        return;
      }
  
      // Single API call for both status update and notification
      await axios.put(`/api/donations/${id}/status`, { 
        status,
        adminMessage 
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      // Update local state
      setDonations(prev => prev.map(d => 
        d._id === id ? { ...d, status } : d
      ));
  
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
    }
  };
  // Define chartData HERE, after state declarations but before conditional returns
  const chartData = {
    labels: ['Money', 'Items'],
    datasets: [{
      label: 'Donation Types',
      data: [totalMoney, totalItems],
      backgroundColor: ['#8D6E63', '#A1887F'],
    }]
  };
  if (loading) return <div className="loading-overlay">Loading donations...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="donation-container">
      <h1 className='text-center'>Manage Donations</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="flex items-center">
            <MdAttachMoney className="stat-icon" />
            <div>
              <h3>Total Money</h3>
              <p>${totalMoney.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center">
            <MdInventory className="stat-icon" />
            <div>
              <h3>Total Items</h3>
              <p>{totalItems}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center">
            <MdEmail className="stat-icon" />
            <div>
              <h3>Total Donations</h3>
              <p>{donations.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <Bar 
          data={chartData} 
          options={{ 
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { 
                display: true, 
                text: 'Donation Distribution',
                font: {
                  family: 'Cinzel',
                  size: 18
                }
              }
            },
            scales: {
              y: {
                ticks: {
                  font: {
                    family: 'Raleway'
                  }
                }
              }
            }
          }} 
        />
      </div>

      <table className="donations-table">
        <thead>
          <tr>
            <th>Donor</th>
            <th>Type</th>
            <th>Details</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {donations.map(donation => (
            <tr key={donation._id}>
              <td>
                <p className="donor-name">{donation.user?.name}</p>
                <p className="donor-email">{donation.user?.email}</p>
              </td>
              <td>
                <span className="donation-type">{donation.type}</span>
              </td>
              <td>
                {donation.type === 'money' ? (
                  <div>
                    <p className="amount">${donation.amount} {donation.currency}</p>
                    <p className="transfer-method">Via Bank Transfer</p>
                  </div>
                ) : (
                  <div>
                    <p className="item-count">{donation.items.length} items</p>
                    <p className="pickup-address">{donation.pickupAddress}</p>
                  </div>
                )}
              </td>
              <td>
                <span className={`status-badge ${donation.status}`}>
                  {donation.status}
                </span>
              </td>
              <td>
                {donation.status === 'pending' && (
                  <button
                    onClick={() => handleStatusUpdate(donation._id, 'approved')}
                    className="action-button approve-btn"
                  >
                    Approve
                  </button>
                )}
                <button
                  onClick={() => handleStatusUpdate(donation._id, 'rejected')}
                  className="action-button reject-btn"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageDonations;