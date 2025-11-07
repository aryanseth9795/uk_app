// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import searchReducer from './slices/searchSlice';
import catalogReducer from './slices/catalogSlice'; 

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    product: productReducer,
    search: searchReducer,
    catalog: catalogReducer, // <-- added
  },
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
