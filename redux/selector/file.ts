import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectProcess = createSelector(
  (state: RootState) => state.file,
  file => file.process,
);
