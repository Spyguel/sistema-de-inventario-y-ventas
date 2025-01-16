import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'; // Verifica la autenticación
  return isAuthenticated ? children : <Navigate to="/login" />;
};


export default ProtectedRoute;