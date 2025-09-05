import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Створюємо асинхронну дію для отримання даних з кошика
export const fetchBasket = createAsyncThunk(
  "basket/fetchBasket", // Унікальний тип дії
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("https://api.thedogapi.com/v1/breeds");
      // Повертаємо отримані дані
      return response.data;
    } catch (error) {
      // У випадку помилки, повертаємо її за допомогою rejectWithValue
      // Це дозволить extraReducers обробити помилку
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
