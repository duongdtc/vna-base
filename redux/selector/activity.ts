import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectListActivityByAgent = createSelector(
  (state: RootState) => state.activity,
  activity => activity.ActivityByAgent,
);

export const selectResultFilterActivity = createSelector(
  (state: RootState) => state.activity,
  activity => activity.resultFilterActivity,
);
