import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import authReducer from './userSlice';
import snackbarReducer from './snackbarSlice';
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'] // Only persist the auth slice
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    snackbar: snackbarReducer,
  },
});

export const persistor = persistStore(store);
