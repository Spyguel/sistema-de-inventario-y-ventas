import { useState, useEffect } from 'react';

const useContactoItem = () => {
  const [contactoItems, setContactoItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener todas las relaciones contacto-ítem
  const fetchContactoItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/contacto_item');
      if (!response.ok) {
        throw new Error('Error al obtener las asociaciones');
      }
      const data = await response.json();
      setContactoItems(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching contacto items:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar las relaciones al montar el componente
  useEffect(() => {
    fetchContactoItems();
  }, []);

   // Función para obtener los ítems asociados a un contacto específico
   const getContactoItemsByContacto = async (id_contacto) => {
    try {
      console.log('Obteniendo ítems asociados para el contacto con ID:', id_contacto); // Verificar el ID del contacto
  
      const response = await fetch(`http://localhost:3000/contacto_item/contacto/${id_contacto}`);
      console.log('Respuesta del servidor:', response); // Verificar la respuesta del servidor
  
      if (!response.ok) {
        throw new Error('Error al obtener las relaciones del contacto');
      }
  
      const data = await response.json();
      console.log('Datos recibidos del servidor:', data); // Verificar los datos recibidos
  
      // Verificar si la respuesta tiene la propiedad "items"
      if (!data.items) {
        console.error('La respuesta del servidor no tiene la propiedad "items":', data);
        throw new Error('Formato de respuesta inválido');
      }
  
      console.log('Ítems asociados obtenidos:', data.items); // Verificar los ítems asociados
      return data.items; // Devolver los ítems asociados
    } catch (error) {
      console.error('Error al obtener contacto-item por contacto:', error);
      throw error;
    }
  };


  // Función para crear o actualizar una relación contacto-ítem
  const handleGuardarContactoItem = async (contactoItem) => {
    console.log("Llega al GuardarItem: ", contactoItem);

    const { id_contacto, id_item } = contactoItem;

    try {
      // Verificar si la relación ya existe
      const checkResponse = await fetch(
        `http://localhost:3000/contacto_item/check-relation/${id_contacto}/${id_item}`
      );

      if (!checkResponse.ok) {
        throw new Error('Error al verificar la relación');
      }

      const { exists } = await checkResponse.json(); // Asume que el backend devuelve { exists: true/false }

      if (exists) {
        // Si la relación ya existe, actualizarla
        const updateResponse = await fetch(`http://localhost:3000/contacto_item/${id_contacto}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id_contacto, id_item }),
        });

        if (!updateResponse.ok) {
          throw new Error('Error al actualizar la relación');
        }
      } else {
        // Si la relación no existe, crearla
        const createResponse = await fetch('http://localhost:3000/contacto_item', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id_contacto, id_item }),
        });

        if (!createResponse.ok) {
          throw new Error('Error al crear la relación');
        }
      }

      // Actualizar la lista de relaciones después de guardar
      fetchContactoItems();
      return true;
    } catch (error) {
      console.error('Error al guardar contacto-item:', error);
      return false;
    }
  };

  // Función para eliminar todas las relaciones de un contacto específico
  const handleEliminarContactoItem = async (id_contacto) => {
    try {
      // Eliminar todas las relaciones del contacto
      const deleteResponse = await fetch(
        `http://localhost:3000/contacto_item/delete-by-contacto/${id_contacto}`,
        {
          method: 'DELETE',
        }
      );

      if (!deleteResponse.ok) {
        throw new Error('Error al eliminar las asociaciones');
      }

      // Actualizar la lista de relaciones después de eliminar
      fetchContactoItems();
      return true;
    } catch (error) {
      console.error('Error al eliminar contacto-item:', error);
      return false;
    }
  };

  return {
    contactoItems,
    loading,
    error,
    fetchContactoItems,
    getContactoItemsByContacto,
    handleGuardarContactoItem,
    handleEliminarContactoItem,
    
  };
};

export default useContactoItem;