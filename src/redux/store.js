import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "./slices/categoriesSlice";
import productsReducer from "./slices/productsSlice";
import basketReducer from "./slices/basketSlice"; // <--- імпортуємо новий редюсер

export { fetchCategories } from "./slices/categoriesSlice";
export { fetchProducts } from "./slices/productsSlice";

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    products: productsReducer,
    basket: basketReducer,
  },
});
