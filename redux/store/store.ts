import { configureStore } from '@reduxjs/toolkit';
import { allReducer } from '@store/all-reducers';
import { persistReducer, persistStore } from 'redux-persist';

/**
 * Use this instead storage of reduxPersist
 */
import { listenerMiddleware } from '@redux/listener';
import { reduxPersistStorage } from '@vna-base/utils';
const persistedReducer = persistReducer(
  {
    key: 'root',
    storage: reduxPersistStorage,
    whitelist: ['app', 'authentication'],
  },
  allReducer,
);

const middleware = [] as any[];

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
