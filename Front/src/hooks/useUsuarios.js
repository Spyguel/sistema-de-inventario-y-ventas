// hooks/useUsuario.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useUsuario = () => {
    const navigate = useNavigate();
    
    const [estadoUsuario, setEstadoUsuario] = useState({
        userId: localStorage.getItem('userId') || null,
        rol: localStorage.getItem('rol') || null,
        token: localStorage.getItem('token') || null,
        permisos: JSON.parse(localStorage.getItem('permisos') || '[]')
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setEstadoUsuario({
            userId: localStorage.getItem('userId'),
            rol: localStorage.getItem('rol'),
            token: localStorage.getItem('token'),
            permisos: JSON.parse(localStorage.getItem('permisos') || '[]')
        });
    }, []);

    const tienePermiso = (permisoRequerido) => {
        return estadoUsuario.permisos?.includes(permisoRequerido) || false;
    };

    const esAdministrador = () => {
        return estadoUsuario.rol === "Administrador";
    };

    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('rol', data.rol);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('permisos', JSON.stringify(data.permisos));

                setEstadoUsuario({
                    userId: data.userId,
                    rol: data.rol,
                    token: data.token,
                    permisos: data.permisos || []
                });

                navigate('/dashboard');
            } else {
                throw new Error(data.error || 'Error de autenticación');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        localStorage.removeItem('userId');
        localStorage.removeItem('permisos');
        setEstadoUsuario({ 
            userId: null, 
            rol: null, 
            token: null,
            permisos: [] 
        });
        navigate('/login');
    };

    return {
        usuario: estadoUsuario,
        loading,
        error,
        login,
        logout,
        tienePermiso, // Función añadida
        esAdministrador // Función añadida
    };
};

export default useUsuario;