// hooks/useUsuario.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useUsuario = () => {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Función para iniciar sesión
    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Almacenar el token, el rol y el ID del usuario en localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('rol', data.rol);
                localStorage.setItem('userId', data.userId);

                // Redirigir al dashboard
                navigate('/dashboard');
            } else {
                throw new Error(data.error || 'Error al iniciar sesión');
            }
        } catch (err) {
            setError(err.message || 'Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        localStorage.removeItem('userId');
        setUsuario(null);
        navigate('/login');
    };

    // Función para obtener los datos del usuario logueado
    const getUsuarioLogueado = async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            setError('No se ha encontrado sesión');
            setLoading(false);
            return null;
        }

        try {
            const response = await fetch(`http://localhost:3000/usuarios/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener los datos del usuario');
            }

            const data = await response.json();
            setUsuario(data);
            return data;
        } catch (err) {
            setError(err.message);
            return null;
        }
        finally {
            setLoading(false);
        }
    };

    return {
        usuario,
        loading,
        error,
        login,
        logout,
        getUsuarioLogueado,
    };
};

export default useUsuario;