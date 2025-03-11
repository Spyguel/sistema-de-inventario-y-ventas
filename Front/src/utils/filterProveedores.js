// utils/filterProveedores.js
import { TIPOS_CONTACTOS } from '../components/common/common/ui/const';

export const getFilteredProveedoresData = (proveedores, searchConfig, filterData) => {
  const { term, filters } = searchConfig;

  // Filtrar solo aquellos contactos cuyo tipo sea "Proveedor"
  const proveedoresData = proveedores.filter(
    contacto => contacto.tipo_contacto === TIPOS_CONTACTOS.PROVEEDOR
  );

  const filteredData = filterData(proveedoresData, term, filters);

  // Convertir el campo 'activo' a 'Activo' o 'Inactivo'
  return filteredData.map(proveedor => ({
    ...proveedor,
    activo: proveedor.activo ? 'Activo' : 'Inactivo'
  }));
};