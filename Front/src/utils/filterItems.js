import { TIPOS_ITEM, TIPOS_CONTACTOS } from '../components/common/common/ui/const';

/**
 * Filtra los ítems según el tipo de contacto seleccionado.
 * Si es proveedor, filtra además por el id del proveedor.
 * 
 * @param {Array} items - Lista de ítems activos.
 * @param {string} tipoContacto - Tipo de contacto seleccionado ("Proveedor" o "Cliente").
 * @param {string|number} [supplierId] - Id del proveedor, requerido para filtrar los ítems de proveedor.
 * @returns {Array} - Ítems filtrados según el tipo de contacto.
 */
export const getFilteredItemData = (items, tipoContacto, supplierId = null) => {
  if (!tipoContacto) {
    return []; // Si no hay tipo de contacto, no se muestran ítems
  }

  const tipoItem =
    tipoContacto === TIPOS_CONTACTOS.PROVEEDOR
      ? TIPOS_ITEM.MATERIA_PRIMA
      : TIPOS_ITEM.PRODUCTO_TERMINADO;

  let filtered = items.filter(item => item.tipo_item === tipoItem);

  if (tipoContacto === TIPOS_CONTACTOS.PROVEEDOR && supplierId) {
    // Filtrar solo los ítems que pertenezcan al proveedor seleccionado.
    filtered = filtered.filter(item => String(item.proveedorId) === String(supplierId));
  }
  return filtered;
};
