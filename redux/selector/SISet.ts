import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectListSISet = createSelector(
  (state: RootState) => state.siset,
  siset => siset.listSISet,
);

export const selectAllSIset = createSelector(
  (state: RootState) => state.siset,
  siset => siset.allSISet,
);
