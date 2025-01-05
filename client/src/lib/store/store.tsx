'use client'

import { configureStore } from '@reduxjs/toolkit';
import { 
  persistReducer, 
  persistStore,
} from 'redux-persist';
import { createTransform } from 'redux-persist';
import type { WebStorage } from 'redux-persist/lib/types';
// Import storage with type assertion
import storage from 'redux-persist/lib/storage';
// Import the constants from the correct location
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist/es/constants';
import { adminApiSlice } from '../feature/auth/adminApiSlice';
import authReducer from '../feature/auth/authSlice';
import userMachineReducer from '../feature/userMachine/usermachineApi';
import { baseApiSlice } from './apiSlice';
import { miningMachinesApiSlice } from '../feature/Machines/miningMachinesApiSlice';

// Define persist keys as constants
const PERSIST_KEYS = {
  ROOT: 'root',
  AUTH: 'auth',
  USER_MACHINE: 'userMachine',
} as const;

interface PersistConfig {
  key: string;
  storage: WebStorage;
  whitelist: string[];
}

const persistConfig: PersistConfig = {
  key: PERSIST_KEYS.ROOT,
  storage,
  whitelist: [PERSIST_KEYS.AUTH, PERSIST_KEYS.USER_MACHINE],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedUserMachineReducer = persistReducer(persistConfig, userMachineReducer);

export const store = configureStore({
  reducer: {
    [baseApiSlice.reducerPath]: baseApiSlice.reducer,
    [PERSIST_KEYS.AUTH]: persistedAuthReducer,
    [PERSIST_KEYS.USER_MACHINE]: persistedUserMachineReducer,
    [miningMachinesApiSlice.reducerPath]: miningMachinesApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      baseApiSlice.middleware,
      miningMachinesApiSlice.middleware
    ),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;