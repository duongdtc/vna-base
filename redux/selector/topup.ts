import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectResultFilterTopup = createSelector(
  (state: RootState) => state.topup,
  topupHistory => topupHistory.resultFilter,
);

export const selectLoadingFilterTopup = createSelector(
  (state: RootState) => state.topup,
  topupHistory => topupHistory.loadingFilter,
);

export const selectAllTypeTopup = createSelector(
  (state: RootState) => state.topup,
  topupHistory => topupHistory.allType,
);
