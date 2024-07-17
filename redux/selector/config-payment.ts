import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectAllPayMethod = createSelector(
  (state: RootState) => state.configPayment,
  configPayment => configPayment.payMethods,
);
