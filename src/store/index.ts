// Redux Store - Simplified for Auth + Cart Only
// Server state now managed by TanStack Query
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer, persistStore } from "redux-persist";

// Slices
import auth from "./slices/authSlice";
import cart from "./slices/cartSlice";
import address from "./slices/addressSlice";

// ===================================
// ROOT REDUCER
// ===================================

const rootReducer = combineReducers({
  auth, // User authentication state
  cart, // Shopping cart (persisted)
  address, // Primary address ID (persisted)
});

// ===================================
// PERSIST CONFIGURATION
// ===================================

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["cart", "address"], // Persist cart and primary address ID, auth tokens stored in SecureStore
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ===================================
// STORE CONFIGURATION
// ===================================

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

// ===================================
// TYPES
// ===================================

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
