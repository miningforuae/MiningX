'use client'

import { configureStore } from '@reduxjs/toolkit';
import { 
  persistReducer, 
  persistStore,
} from 'redux-persist';
import { createTransform } from 'redux-persist';
import type { WebStorage } from 'redux-persist/lib/types';
import storage from 'redux-persist/lib/storage';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist/es/constants';
import { adminApiSlice } from '../feature/auth/adminApiSlice';
import authReducer from '../feature/auth/authSlice';
import userMachineReducer from '../feature/userMachine/usermachineApi';
import { baseApiSlice } from './apiSlice';
import { miningMachinesApiSlice } from '../feature/Machines/miningMachinesApiSlice';
import withdrawalReducer from '../feature/withdraw/withdrawalSlice'

const PERSIST_KEYS = {
  ROOT: 'root',
  AUTH: 'auth',
  USER_MACHINE: 'userMachine',
  WITHDRAWAL: 'withdrawal',  
} as const;

interface PersistConfig {
  key: string;
  storage: WebStorage;
  whitelist: string[];
}

const persistConfig: PersistConfig = {
  key: PERSIST_KEYS.ROOT,
  storage,
  whitelist: [PERSIST_KEYS.AUTH, PERSIST_KEYS.USER_MACHINE, PERSIST_KEYS.WITHDRAWAL], // Add WITHDRAWAL
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedUserMachineReducer = persistReducer(persistConfig, userMachineReducer);
const persistedWithdrawalReducer = persistReducer(persistConfig, withdrawalReducer); // Add this

export const store = configureStore({
  reducer: {
    [baseApiSlice.reducerPath]: baseApiSlice.reducer,
    [PERSIST_KEYS.AUTH]: persistedAuthReducer,
    [PERSIST_KEYS.USER_MACHINE]: persistedUserMachineReducer,
    [PERSIST_KEYS.WITHDRAWAL]: persistedWithdrawalReducer, // Add this
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;