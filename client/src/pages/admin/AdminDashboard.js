import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [stats, setStats] = useState({
    users: 0,
    pets: 0,
    adoptions: 0,
    rescues: 0,
    volunteers: 0,
    surrenders: 0,
    donations: 0,
    activeVolunteers: 0,
    pendingDonations: 0,
    appointments: 0
  });

  // Sample data for charts
  const adoptionTrends = [
    { month: 'Jan', adoptions: 12, donations: 4500 },
    { month: 'Feb', adoptions: 19, donations: 6200 },
    { month: 'Mar', adoptions: 8, donations: 3800 },
    { month: 'Apr', adoptions: 15, donations: 5100 },
    { month: 'May', adoptions: 12, donations: 4900 },
    { month: 'Jun', adoptions: 18, donations: 6800 },
  ];

  const locationData = [
    { name: 'Islamabad', value: 35 },
    { name: 'Rawalpindi', value: 28 },
    { name: 'Karachi', value: 20 },
    { name: 'Lahore', value: 17 },
  ];

  const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('No admin token found');
        
        const profile = await axios.get('/api/admin/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const statsRes = await axios.get('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setAdminData(profile.data);
        setStats(statsRes.data);
      } catch (err) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) return (
    <div className="admin-loading">
      <div className="loading-spinner"></div>
      <p>Initializing Dashboard...</p>
    </div>
  );

  return (
    <div className="admin-container">
      <div className="admin-content-wrapper">
        {/* Header Section */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Welcome back, {adminData?.name || 'Admin'}</h1>
            <p className="last-login">
              📅 Last login: {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
              })}
            </p>
            <div className="quick-actions">
              <button className="action-btn primary">
                🐾 Add New Pet
              </button>
              <button className="action-btn success">
                👥 Manage Users
              </button>
              <button className="action-btn warning">
                💰 View Donations
              </button>
            </div>
          </div>
          <div className="admin-profile">
            <img 
              src={adminData?.avatar || '/images/default-avatar.jpg'} 
              alt="Admin Avatar" 
              className="admin-avatar"
            />
            <div className="profile-info">
              <span className="admin-name">{adminData?.name || 'Admin User'}</span>
              <span className="admin-email">{adminData?.email || 'admin@example.com'}</span>
              <div className="system-status">
                <span className="status-indicator active"></span>
                <span>System Status: Operational</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <div className="dashboard-grid">
          
          {/* Key Metrics Section */}
          <div className="metrics-grid container">
            <div className="row g-3">
              <div className="col-12 col-md-6 col-lg-3">
                <div className="metric-card">
                  <div className="metric-icon primary">
                    👥
                  </div>
                  <div className="metric-content">
                    <h3>Total Users</h3>
                    <p>{stats.users}</p>
                    <div className="metric-trend">
                      <span className="positive">↑ 8.2%</span> from last month
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <div className="metric-card">
                  <div className="metric-icon success">
                    🐾
                  </div>
                  <div className="metric-content">
                    <h3>Available Pets</h3>
                    <p>{stats.pets}</p>
                    <div className="metric-trend">
                      <span className="positive">↑ 12%</span> new additions
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <div className="metric-card">
                  <div className="metric-icon warning">
                    🏠
                  </div>
                  <div className="metric-content">
                    <h3>Total Adoptions</h3>
                    <p>{stats.adoptions}</p>
                    <div className="metric-trend">
                      <span className="positive">↑ 15%</span> this quarter
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <div className="metric-card">
                  <div className="metric-icon danger">
                    📍
                  </div>
                  <div className="metric-content">
                    <h3>Active Rescues</h3>
                    <p>{stats.rescues}</p>
                    <div className="metric-trend">
                      <span className="negative">↓ 3%</span> response time
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-container">
            <div className="main-chart">
              <h3>
                📈 Monthly Performance Overview
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={adoptionTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="adoptions" fill="#4CAF50" />
                  <Bar dataKey="donations" fill="#2196F3" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="side-charts">
              <div className="pie-chart">
                <h3>Regional Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={locationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {locationData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="quick-stats">
                <div className="stat-item">
                  <span className="stat-label">Pending Approvals</span>
                  <span className="stat-value">{stats.surrenders}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Active Volunteers</span>
                  <span className="stat-value">{stats.volunteers}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Upcoming Appointments</span>
                  <span className="stat-value">{stats.appointments}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="recent-activity">
            <h3>Recent Activity Log</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon success">
                  🏠
                </div>
                <div className="activity-content">
                  <p>New adoption approved for Max (Golden Retriever)</p>
                  <span className="activity-time">2 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon warning">
                  🐾
                </div>
                <div className="activity-content">
                  <p>New pet added: Luna (Persian Cat)</p>
                  <span className="activity-time">4 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon primary">
                  👥
                </div>
                <div className="activity-content">
                  <p>New user registration: ahmad@example.com</p>
                  <span className="activity-time">6 hours ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Metrics */}
          <div className="system-metrics">
            <h3>System Performance</h3>
            <div className="metric-bars">
              <div className="metric-bar">
                <label>Server Load</label>
                <div className="bar-container">
                  <div className="bar-fill" style={{ width: '65%' }}></div>
                  <span>65%</span>
                </div>
              </div>
              <div className="metric-bar">
                <label>Database Health</label>
                <div className="bar-container">
                  <div className="bar-fill" style={{ width: '92%' }}></div>
                  <span>92%</span>
                </div>
              </div>
              <div className="metric-bar">
                <label>API Response</label>
                <div className="bar-container">
                  <div className="bar-fill" style={{ width: '98%' }}></div>
                  <span>98%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;