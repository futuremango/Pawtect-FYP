import { Navigate, Outlet } from 'react-router-dom';

const ProtectedAdminRoute = () => {
  const adminToken = localStorage.getItem('adminToken');
  const adminData = JSON.parse(localStorage.getItem('admin') || '{}');
  
  console.log('[ADMIN ROUTE GUARD] Checking access:', {
    hasToken: !!adminToken,
    adminEmail: adminData.email,
    timestamp: new Date().toISOString()
  });

  if (!adminToken) {
    console.warn('[ADMIN ACCESS DENIED] No admin token found');
    alert('Admin authentication required!');
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;