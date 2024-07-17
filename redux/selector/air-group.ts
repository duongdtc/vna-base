import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectAllAirGroups = createSelector(
  (state: RootState) => state.airGroup,
  airGroup => airGroup.allAirGroups,
);
