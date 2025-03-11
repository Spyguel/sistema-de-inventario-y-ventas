// utils/filterMovimientos.js
export const getFilteredMovimientosData = (movimientos, searchConfig, filterData) => {
    const { term, filters } = searchConfig;
    return filterData(movimientos, term, filters);
  };
  