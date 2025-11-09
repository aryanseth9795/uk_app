// // // src/store/index.ts
// // import { configureStore } from '@reduxjs/toolkit';
// // import cartReducer from './slices/cartSlice';
// // import productReducer from './slices/productSlice';
// // import searchReducer from './slices/searchSlice';
// // import catalogReducer from './slices/catalogSlice'; 

// // export const store = configureStore({
// //   reducer: {
// //     cart: cartReducer,
// //     product: productReducer,
// //     search: searchReducer,
// //     catalog: catalogReducer, // <-- added
// //   },
// //   middleware: (getDefault) =>
// //     getDefault({
// //       serializableCheck: false,
// //     }),
// // });

// // export type RootState = ReturnType<typeof store.getState>;
// // export type AppDispatch = typeof store.dispatch;


// // import { configureStore, combineReducers } from '@reduxjs/toolkit';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { persistReducer, persistStore } from 'redux-persist';
// // import thunk from 'redux-thunk';

// // import cartReducer from './slices/cartSlice';
// // import catalogReducer from './slices/catalogSlice';
// // import searchReducer from './slices/searchSlice';
// // import authReducer from './slices/authSlice';

// // const rootReducer = combineReducers({
// //   cart: cartReducer,
// //   catalog: catalogReducer,
// //   search: searchReducer,
// //   auth: authReducer,
// // });

// // const persistConfig = {
// //   key: 'root',
// //   storage: AsyncStorage,
// //   whitelist: ['cart', 'auth'], // persist auth & cart only
// // };

// // const persistedReducer = persistReducer(persistConfig, rootReducer);

// // export const store = configureStore({
// //   reducer: persistedReducer,
// //   middleware: [thunk],
// // });

// // export const persistor = persistStore(store);
// // export type RootState = ReturnType<typeof store.getState>;
// // export type AppDispatch = typeof store.dispatch;
// import { configureStore, combineReducers } from '@reduxjs/toolkit';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { persistReducer, persistStore } from 'redux-persist';

// import cartReducer from './slices/cartSlice';
// import catalogReducer from './slices/catalogSlice';
// import searchReducer from './slices/searchSlice';
// import authReducer from './slices/authSlice';

// // Combine all reducers
// const rootReducer = combineReducers({
//   cart: cartReducer,
//   catalog: catalogReducer,
//   search: searchReducer,
//   auth: authReducer,
// });

// // Redux Persist config
// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
//   whitelist: ['cart', 'auth'], // persist these slices
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // ✅ FIX — Do NOT manually import or concat thunk
// // Redux Toolkit already includes redux-thunk internally
// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false, // ignore non-serializable checks for redux-persist
//     }),
// });

// export const persistor = persistStore(store);

// // Types
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
// src/store/index.ts
// import { configureStore } from '@reduxjs/toolkit';
// import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

// import auth from './slices/authSlice';
// import catalog from './slices/catalogSlice';
// import cart from './slices/cartSlice';
// import search from './slices/searchSlice';

// export const store = configureStore({
//   reducer: { auth, catalog, cart, search },
//   middleware: (gDM) => gDM({ serializableCheck: false }),
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// // attach interceptors AFTER store exists
// import { attachAuthInterceptors } from '@services/api';
// attachAuthInterceptors(store);


// src/store/index.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';

import auth, { refreshAccessToken, logout } from './slices/authSlice';
import catalog from './slices/catalogSlice';
import cart from './slices/cartSlice';
import search from './slices/searchSlice';

import { setAuthHandlers } from '@services/http';

const rootReducer = combineReducers({ auth, catalog, cart, search });

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['cart'], // keep tokens in SecureStore, not here
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (gDM) => gDM({ serializableCheck: false }),
});

// Connect axios interceptors to Redux state/dispatch here
setAuthHandlers({
  getAccessToken: () => store.getState().auth.accessToken,
  refreshAccessToken: async () => {
    const action = await store.dispatch(refreshAccessToken());
    if (refreshAccessToken.fulfilled.match(action)) {
      return (action as any).payload?.accessToken ?? store.getState().auth.accessToken ?? null;
    }
    return null;
  },
  onLogout: () => {
    store.dispatch(logout());
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
