// utils/filterStock.js
export const getFilteredStockData = (stock, searchConfig, filterData) => {
    const { term, filters } = searchConfig;
    return filterData(stock, term, filters);
  };