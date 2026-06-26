import PropTypes from 'prop-types';
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import LoadingOverlay from '../components/LoadingOverlay';

// Blocks unauthenticated users
export function PrivateRoute({ children }) {
  const user = useAuthStore(state => state.user);
  const loading = useAuthStore(state => state.loading);
  if (loading) return <LoadingOverlay />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
PrivateRoute.propTypes = { children: PropTypes.node.isRequired };

// Blocks users without the required role
export function RoleRoute({ children, requiredRole }) {
  const profile = useAuthStore(state => state.profile);
  const loading = useAuthStore(state => state.loading);
  const user = useAuthStore(state => state.user);
  
  if (loading) return <LoadingOverlay />;
  
  // If we have a user but no profile after loading, it's a fatal error for this route
  if (user && !profile) {
    // eslint-disable-next-line no-console
    console.error('User authenticated but profile missing');
    return <Navigate to="/login" replace />;
  }
  
  if (!profile) return <Navigate to="/login" replace />;
  
  if (profile.role !== requiredRole && profile.role !== 'admin') {
    // Redirect to their own dashboard
    const target = (profile.role === 'teacher' || profile.role === 'admin') ? '/teacher' : '/student';
    return <Navigate to={target} replace />;
  }
  return children;
}
RoleRoute.propTypes = { children: PropTypes.node.isRequired, requiredRole: PropTypes.string };
