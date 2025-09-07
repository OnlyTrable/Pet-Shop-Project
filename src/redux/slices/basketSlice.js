import { createSlice } from "@reduxjs/toolkit";

// --- LocalStorage Helpers ---
const BASKET_STATE_LS_KEY = "petShopBasketState";

const loadStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem(BASKET_STATE_LS_KEY);
    if (serializedState === null) {
      // Якщо в localStorage нічого немає, повертаємо початковий стан
      return { items: [], status: "idle", error: null };
    }
    const parsedState = JSON.parse(serializedState);
    // Повертаємо завантажений стан, гарантуючи, що items є масивом
    return { items: parsedState.items || [], status: "idle", error: null };
  } catch (err) {
    console.error("Could not load state from localStorage", err);
    return { items: [], status: "idle", error: null };
  }
};

const saveStateToLocalStorage = (state) => {
  try {
    // Зберігаємо тільки масив товарів
    const stateToSave = { items: state.items };
    const serializedState = JSON.stringify(stateToSave);
    localStorage.setItem(BASKET_STATE_LS_KEY, serializedState);
  } catch (err) {
    console.error("Could not save state to localStorage", err);
  }
};

const initialState = loadStateFromLocalStorage();

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addItem(state, action) {
      const item = action.payload;
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += item.quantity || 1;
      } else {
        state.items.push({ ...item, quantity: item.quantity || 1 });
      }
      saveStateToLocalStorage(state);
    },
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveStateToLocalStorage(state);
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const itemToUpdate = state.items.find((item) => item.id === id);
      if (itemToUpdate) {
        itemToUpdate.quantity = quantity;
      }
      saveStateToLocalStorage(state);
    },
  },
});

export const { addItem, removeItem, updateQuantity } = basketSlice.actions;
export const selectBasket = (state) => state.basket.items;
export const selectTotalBasketItems = (state) =>
  state.basket.items.reduce((total, item) => total + item.quantity, 0);

export default basketSlice.reducer;
