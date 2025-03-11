// utils/filterClientes.js
import { TIPOS_CONTACTOS } from '../components/common/common/ui/const';

export const getFilteredClientesData = (clientes, searchConfig, filterData) => {
  const { term, filters } = searchConfig;
  // Filtrar solo aquellos contactos cuyo tipo sea "Cliente"
  const clientesData = clientes.filter(
    contacto => contacto.tipo_contacto === TIPOS_CONTACTOS.CLIENTE
  );
  const filteredData = filterData(clientesData, term, filters);

  // Convertir el campo 'activo' a 'Activo' o 'Inactivo'
  return filteredData.map(proveedor => ({
    ...proveedor,
    activo: proveedor.activo ? 'Activo' : 'Inactivo'
  }));
};
