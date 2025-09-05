import { configureStore } from "@reduxjs/toolkit";
import basketSlice from "./slices/basketSlice"; // Імпортуємо редюсер нашого шматочка
import productSlice from "./slices/productSlice"; // Імпортуємо редюсер нашого шматочка
import categorySlice from "./slices/categorySlice"; // Імпортуємо редюсер нашого шматочка
// Налаштовуємо Redux Store
const store = configureStore({
  reducer: {
    // Додаємо наш basketReducer до кореневого редюсера
    // 'basket' буде ключем у глобальному стані Redux для доступу до стану basketSlice
    basket: basketSlice,
    // Додаємо наш productReducer до кореневого редюсера
    // 'product' буде ключем у глобальному стані Redux для доступу до стану productSlice
    product: productSlice,
    // Додаємо наш categoryReducer до кореневого редюсера
    // 'category' буде ключем у глобальному стані Redux для доступу до стану categorySlice
    category: categorySlice,
  },
});

// Експортуємо налаштований магазин
export default store;
