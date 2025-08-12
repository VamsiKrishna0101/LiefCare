import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';

export default function ProtectedRoute({ role, children }) {
  const { user } = useContext(AuthContext);

  if (user === null) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
}
