// hooks/useUsuario.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useUsuario = () => {
    const navigate = useNavigate();
    
    // Estado inicial desde localStorage
    const [estadoUsuario, setEstadoUsuario] = useState({
        userId: localStorage.getItem('userId') || null,
        rol: localStorage.getItem('rol') || null,
        token: localStorage.getItem('token') || null
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Sincronizar estado con localStorage al montar
    useEffect(() => {
        setEstadoUsuario({
            userId: localStorage.getItem('userId'),
            rol: localStorage.getItem('rol'),
            token: localStorage.getItem('token')
        });
    }, []);

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
                // Guardar solo datos esenciales en localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('rol', data.rol);
                localStorage.setItem('userId', data.userId);

                // Actualizar estado
                setEstadoUsuario({
                    userId: data.userId,
                    rol: data.rol,
                    token: data.token
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
        // Limpiar almacenamiento y estado
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        localStorage.removeItem('userId');
        setEstadoUsuario({ userId: null, rol: null, token: null });
        navigate('/login');
    };

    return {
        usuario: estadoUsuario,  // Devuelve datos del localStorage
        loading,
        error,
        login,
        logout
    };
};

export default useUsuario;