import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectAllOffice = createSelector(
  (state: RootState) => state.office,
  office => office.allOffice,
);
