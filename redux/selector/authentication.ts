import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectToken = createSelector(
  (state: RootState) => state.authentication,
  auth => auth.token,
);
