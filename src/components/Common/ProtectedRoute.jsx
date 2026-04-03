import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // Assuming the user object has an 'isAdmin' flag
  // You might need to adjust this based on your actual user data structure
  if (user && user.email === 'arerajendhar33@gmail.com') {
    return children;
  }

  return <Navigate to="/admin/login" />;
};

export default ProtectedRoute;
