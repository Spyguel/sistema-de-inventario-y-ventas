import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticated = () => {
    const token = localStorage.getItem('token'); 

    if (!token) return false; // No hay token, no está autenticado

    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar el token
        const isExpired = payload.exp * 1000 < Date.now(); // Comparar con la fecha actual
        return !isExpired; // Devuelve true si no ha expirado, false si sí
    } catch (error) {
        console.error('Error:', error);
        return false; // Si el token no es válido, devuelve false
    }
};

const ProtectedRoute = () => {
    return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;