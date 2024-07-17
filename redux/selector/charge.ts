import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectCharges = createSelector(
  (state: RootState) => state.charge,
  charge => charge.charges,
);

export const selectIsLoadingCharges = createSelector(
  (state: RootState) => state.charge,
  charge => charge.isLoadingCharge,
);
