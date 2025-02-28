import { useState, useEffect } from 'react';

const useContactos = () => {
  const [contactos, setContactos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContactos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/contacto_movimiento');
      if (!response.ok) {
        throw new Error('Error al obtener contactos');
      }
      const data = await response.json();
      setContactos(data.contactos);
      setError(null);
      console.log('Contactos recuperados:', data.contactos);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching contactos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactos();
  }, []);

  return { contactos, loading, error, fetchContactos };
};

export default useContactos;
