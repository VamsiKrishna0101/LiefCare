import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';

export default function ProtectedRoute({ role, children }) {
  const { user } = useContext(AuthContext);

  // While user is being loaded (optional)
  if (user === null) {
    // You can return a loader here if you want
    return <div>Loading...</div>;
  }

  if (!user) {
    // Not logged in - redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // Logged in but not authorized for this route
    return <Navigate to="/" replace />;
  }

  // Authorized - render children
  return children;
}
