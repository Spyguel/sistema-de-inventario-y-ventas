
import { useState } from 'react';

const useContactoItem = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Función para extraer el id_contacto correctamente
    const extractIdContacto = (id_contacto) => {
        if (typeof id_contacto === 'object' && id_contacto !== null) {
            const extracted = id_contacto.id_contacto; // Si es un objeto, extrae el id_contacto
            console.log('extractIdContacto - Extraído:', extracted);
            return extracted;
        }
        console.log('extractIdContacto - Valor directo:', id_contacto);
        return id_contacto; // Si ya es un número, lo devuelve directamente
    };
    //Fncion para obtener contactos por id
    const getContactoItemsByContacto = async (id_contacto) => {
        setLoading(true);
        console.log('getContactoItemsByContacto - Iniciado con id_contacto:', id_contacto);
        try {
            // Extrae el id_contacto en el formato correcto
            const id = extractIdContacto(id_contacto);
            console.log('getContactoItemsByContacto - id formateado:', id);

            const response = await fetch(`http://localhost:3000/contacto_item/contacto/${id}`);
            console.log('getContactoItemsByContacto - Respuesta fetch:', response);
            if (!response.ok) {
                throw new Error('Error al obtener las relaciones del contacto');
            }
            const data = await response.json();
            console.log('getContactoItemsByContacto - Data recibida:', data);
            return data.items;
        } catch (error) {
            setError(error.message);
            console.error('Error al obtener contacto-item por contacto:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    //Funcion para guardar el contacto 
    const handleGuardarContactoItem = async ({ id_contacto, selectedItems }) => {
        // Si selectedItems no es un array, lo transformamos:
        if (!Array.isArray(selectedItems)) {
            if (selectedItems !== undefined) {
                // Caso en que se envía un único ítem
                selectedItems = [selectedItems];
            } else {
                console.error('handleGuardarContactoItem - Error: selectedItems no es un array y es undefined');
                setLoading(false);
                return false;
            }
        }
        console.log("hola ", JSON.stringify(selectedItems));
        alert(`Llego hasta guardar contacto con estos items: ${JSON.stringify(selectedItems)}`);
        setLoading(true);
        // Extraer el id de contacto (asegúrate de que extractIdContacto espera un valor primitivo)
        const id = extractIdContacto(id_contacto);
        console.log('handleGuardarContactoItem - id formateado:', id);
        
        // Obtener las relaciones actuales del contacto
        const relacionesActuales = await getContactoItemsByContacto(id);
        console.log('handleGuardarContactoItem - relaciones actuales:', relacionesActuales);
        
        // Filtrar y eliminar ítems que ya no están seleccionados
        if (relacionesActuales && relacionesActuales.length > 0) {
            console.log('handleGuardarContactoItem - Comenzando a filtrar items a eliminar');
            const itemsAEliminar = relacionesActuales.filter(item => {
                const isSelected = selectedItems.includes(item);
                console.log(`Comparando item: ${item} - isSelected: ${isSelected}`);
                return !isSelected;
            });
            console.log('handleGuardarContactoItem - itemsAEliminar:', itemsAEliminar);
        
            // Eliminar las relaciones de los ítems deseleccionados
            for (const id_item of itemsAEliminar) {
                console.log(`handleGuardarContactoItem - Eliminando relación para id_item: ${id_item}`);
                await fetch(`http://localhost:3000/contacto_item/${id}/${id_item}`, {
                    method: 'DELETE',
                });
            }
        }
        
        // Crear nuevas relaciones para los ítems seleccionados
        for (const id_item of selectedItems) {
            console.log(`handleGuardarContactoItem - Procesando id_item seleccionado: ${id_item}`);
            const checkResponse = await fetch(
                `http://localhost:3000/contacto_item/check-relation/${id}/${id_item}`
            );
            console.log(`handleGuardarContactoItem - Respuesta check para ${id_item}:`, checkResponse);
            const { exists } = await checkResponse.json();
            console.log(`handleGuardarContactoItem - Existe relación para ${id_item}?`, exists);
        
            if (!exists) {
                console.log(`handleGuardarContactoItem - Creando nueva relación para id_item: ${id_item}`);
                await fetch('http://localhost:3000/contacto_item', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id_contacto: id, id_item }),
                });
            }
        }
        
        console.log('handleGuardarContactoItem - Operación completada correctamente');
        setLoading(false);
        return true;
    };
    
        // Función que llama a la ruta que devuelve los contactos e ítems ya listos (agrupados)
    const handleObtenerItemsYContactosListos = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/contacto_item/items_contactos_listos');
      if (!response.ok) {
        throw new Error('Error al obtener los datos de contacto e ítems');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      setError(error.message);
      console.error('handleObtenerItemsYContactosListos:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

    return {
        loading,
        error,
        getContactoItemsByContacto,
        handleGuardarContactoItem,
        handleObtenerItemsYContactosListos
    };
};

export default useContactoItem;
