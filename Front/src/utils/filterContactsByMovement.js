// utils/filterContactsByMovement.js
import { TIPOS_MOVIMIENTO } from '../components/common/common/ui/const';
import { getFilteredClientesData } from './filterClientes';
import { getFilteredProveedoresData } from './filterProveedores';

export const getFilteredContactsByMovement = (contactos, searchConfig, filterData, tipoMovimiento) => {
  if (tipoMovimiento === TIPOS_MOVIMIENTO.ENTRADA) {
    return getFilteredProveedoresData(contactos, searchConfig, filterData);
  } else if (tipoMovimiento === TIPOS_MOVIMIENTO.SALIDA) {
    return getFilteredClientesData(contactos, searchConfig, filterData);
  }
  return contactos;
};