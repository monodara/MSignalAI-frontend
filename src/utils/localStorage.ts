// frontend/src/utils/localStorage.ts

const STOCK_LIST_KEY = 'myStockList';

export const getMyStockList = (): string[] => {
  try {
    const storedList = localStorage.getItem(STOCK_LIST_KEY);
    return storedList ? JSON.parse(storedList) : [];
  } catch (error) {
    console.error("Error getting stock list from local storage:", error);
    return [];
  }
};

export const saveMyStockList = (stockList: string[]): void => {
  try {
    localStorage.setItem(STOCK_LIST_KEY, JSON.stringify(stockList));
  } catch (error) {
    console.error("Error saving stock list to local storage:", error);
  }
};

export const addStockToMyList = (symbol: string): boolean => {
  const currentList = getMyStockList();
  if (!currentList.includes(symbol)) {
    const newList = [...currentList, symbol];
    saveMyStockList(newList);
    return true; // Stock added
  }
  return false; // Stock already in list
};

export const removeStockFromMyList = (symbol: string): boolean => {
  const currentList = getMyStockList();
  const newList = currentList.filter(item => item !== symbol);
  if (newList.length < currentList.length) {
    saveMyStockList(newList);
    return true; // Stock removed
  }
  return false; // Stock not found in list
};
