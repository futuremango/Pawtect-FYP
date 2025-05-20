import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  console.log('[Protected Route] Authentication check:', !!token);
  
  return token ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;