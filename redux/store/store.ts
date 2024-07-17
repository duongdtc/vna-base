import { configureStore } from '@reduxjs/toolkit';
import { allReducer } from '@store/all-reducers';
import reduxDebugger from 'redux-flipper';
import { persistReducer, persistStore } from 'redux-persist';

import { listenerMiddleware } from '../listener';

/**
 * Use this instead storage of reduxPersist
 */
import { reduxPersistStorage } from '@vna-base/utils';

const persistedReducer = persistReducer(
  {
    key: 'root',
    storage: reduxPersistStorage,
    whitelist: ['app', 'authentication'],
  },
  allReducer,
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const middleware = [] as any[];

if (__DEV__) {
  middleware.push(reduxDebugger());
}

export const store = configureStore({
  // reducer: allReducer,
  reducer: persistedReducer,
  devTools: __DEV__,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false })
      .prepend(listenerMiddleware.middleware)
      .concat(middleware),
});

export type AppDispatch = typeof store.dispatch;

export const persistore = persistStore(store, {});